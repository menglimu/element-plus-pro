var babel = require("@babel/core");
var parser = require("@babel/parser");
// var generate = require("@babel/generator");
import generate from "@babel/generator";
import traverse from "@babel/traverse";

import ts from "typescript";

export default function transProps(src, id) {
  const ast = parser.parse(src, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name === "$FC") {
        const propsAst = parser.parse('["a","b"]');
        path.node.callee.name = "$FunctionComponent";
        path.node.arguments.unshift(propsAst.program.body[0].expression);
      }
    },
  });
  console.log("%j", ast);

  const res = generate(ast);
  console.log(res);
  return res;
}

const createArrayExpression = ts.factory ? ts.factory.createArrayLiteralExpression : ts.createArrayLiteral;
const createStringLiteral = ts.factory ? ts.factory.createStringLiteral : ts.createLiteral;

export function transformer(program) {
  return (context) => (file) => visitNodeAndChildren(file, program, context);
}

function visitNodeAndChildren(node, program, context) {
  return ts.visitEachChild(
    visitNode(node, program),
    (childNode) => visitNodeAndChildren(childNode, program, context),
    context
  );
}

function visitNode(node, program) {
  const typeChecker = program.getTypeChecker();
  if (!node.typeArguments) {
    return createArrayExpression([]);
  }
  const type = typeChecker.getTypeFromTypeNode(node.typeArguments[0]);
  const properties = typeChecker.getPropertiesOfType(type);
  return createArrayExpression(properties.map((property) => createStringLiteral(property.name)));
}

// extractRuntimeProps(propsTypeDecl, declaredTypes);

function recordType(node, declaredTypes) {
  if (node.type === "TSInterfaceDeclaration") {
    declaredTypes[node.id.name] = [`Object`];
  } else if (node.type === "TSTypeAliasDeclaration") {
    declaredTypes[node.id.name] = inferRuntimeType(node.typeAnnotation, declaredTypes);
  } else if (node.type === "ExportNamedDeclaration" && node.declaration) {
    recordType(node.declaration, declaredTypes);
  }
}

function isQualifiedType(node, qualifier, refName) {
  if (node.type === "TSInterfaceDeclaration" && node.id.name === refName) {
    return node.body;
  } else if (node.type === "TSTypeAliasDeclaration" && node.id.name === refName && qualifier(node.typeAnnotation)) {
    return node.typeAnnotation;
  } else if (node.type === "ExportNamedDeclaration" && node.declaration) {
    return isQualifiedType(node.declaration, qualifier, refName);
  }
}
function resolveExtendsType(node, qualifier, cache) {
  if (node.type === "TSInterfaceDeclaration" && node.extends) {
    node.extends.forEach((extend) => {
      if (extend.type === "TSExpressionWithTypeArguments" && extend.expression.type === "Identifier") {
        const body = getAstBody();
        for (const node of body) {
          const qualified = isQualifiedType(node, qualifier, extend.expression.name);
          if (qualified) {
            cache.push(qualified);
            resolveExtendsType(node, qualifier, cache);
            return cache;
          }
        }
      }
    });
  }
  return cache;
}
function getAstBody() {
  return ast.program.body;
}

function resolveQualifiedType(node, qualifier) {
  if (qualifier(node)) {
    return node;
  }
  if (node.type === "TSTypeReference" && node.typeName.type === "Identifier") {
    const refName = node.typeName.name;
    const body = getAstBody();
    for (const node of body) {
      let qualified = isQualifiedType(node, qualifier, refName);
      if (qualified) {
        const extendsTypes = resolveExtendsType(node, qualifier);
        if (extendsTypes.length) {
          const bodies = [...qualified.body];
          filterExtendsType(extendsTypes, bodies);
          qualified.body = bodies;
        }
        return qualified;
      }
    }
  }
}

function extractRuntimeProps(node, declaredTypes) {
  const members = node.type === "TSTypeLiteral" ? node.members : node.body;
  const props = {};
  for (const m of members) {
    if ((m.type === "TSPropertySignature" || m.type === "TSMethodSignature") && m.key.type === "Identifier") {
      let type;
      if (m.type === "TSMethodSignature") {
        type = ["Function"];
      } else if (m.typeAnnotation) {
        type = inferRuntimeType(m.typeAnnotation.typeAnnotation, declaredTypes);
      }
      props[m.key.name] = {
        key: m.key.name,
        required: !m.optional,
        type: type || [`null`],
      };
    }
  }
  return props;
}

function inferRuntimeType(node, declaredTypes) {
  switch (node.type) {
    case "TSStringKeyword":
      return ["String"];
    case "TSNumberKeyword":
      return ["Number"];
    case "TSBooleanKeyword":
      return ["Boolean"];
    case "TSObjectKeyword":
      return ["Object"];
    case "TSTypeLiteral":
      // TODO (nice to have) generate runtime property validation
      return ["Object"];
    case "TSFunctionType":
      return ["Function"];
    case "TSArrayType":
    case "TSTupleType":
      // TODO (nice to have) generate runtime element type/length checks
      return ["Array"];

    case "TSLiteralType":
      switch (node.literal.type) {
        case "StringLiteral":
          return ["String"];
        case "BooleanLiteral":
          return ["Boolean"];
        case "NumericLiteral":
        case "BigIntLiteral":
          return ["Number"];
        default:
          return [`null`];
      }

    case "TSTypeReference":
      if (node.typeName.type === "Identifier") {
        if (declaredTypes[node.typeName.name]) {
          return declaredTypes[node.typeName.name];
        }
        switch (node.typeName.name) {
          case "Array":
          case "Function":
          case "Object":
          case "Set":
          case "Map":
          case "WeakSet":
          case "WeakMap":
          case "Date":
          case "Promise":
            return [node.typeName.name];
          case "Record":
          case "Partial":
          case "Readonly":
          case "Pick":
          case "Omit":
          case "Exclude":
          case "Extract":
          case "Required":
          case "InstanceType":
            return ["Object"];
        }
      }
      return [`null`];

    case "TSParenthesizedType":
      return inferRuntimeType(node.typeAnnotation, declaredTypes);
    case "TSUnionType":
      return [...new Set([].concat(...node.types.map((t) => inferRuntimeType(t, declaredTypes))))];
    case "TSIntersectionType":
      return ["Object"];

    case "TSSymbolKeyword":
      return ["Symbol"];

    default:
      return [`null`]; // no runtime check
  }
}
