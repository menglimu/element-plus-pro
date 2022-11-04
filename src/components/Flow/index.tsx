/**
 * @Author: wenlin
 * @Description: 流式布局
 */
import "./index.scss";
interface IProps {
  a: string;
}
export default functionComponent<IProps>(function Flow(props) {
  return () => (
    <div class="container">
      <div class="waterfall">
        <div class="item">
          <img src="https://imgsa.baidu.com/baike/c0%3Dbaike72%2C5%2C5%2C72%2C24/sign=f3d4063328738bd4d02cba63c0e2ecb3/a2cc7cd98d1001e910616de1be0e7bec55e797fa.jpg" />
          <p>1 convallis timestamp</p>
        </div>

        <div class="item">
          <img src="https://imgsa.baidu.com/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=03948ea9b4315c60579863bdecd8a076/8326cffc1e178a825a6b5d1cfe03738da977e833.jpg" />
          <p>2 convallis timestamp 2 Donec a fermentum nisi. </p>
        </div>

        <div class="item">
          <img src="https://imgsa.baidu.com/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=3d645bf2d0ca7bcb6976cf7ddf600006/6d81800a19d8bc3efe5f64fb858ba61ea8d345af.jpg" />
          <p>
            3 Nullam eget lectus augue. Donec eu sem sit amet ligula faucibus suscipit. Suspendisse rutrum turpis quis
            nunc convallis quis aliquam mauris suscipit.
          </p>
        </div>

        <div class="item">
          <img src="https://imgsa.baidu.com/baike/c0%3Dbaike180%2C5%2C5%2C180%2C60/sign=fbc3501b0a087bf469e15fbb93ba3c49/bf096b63f6246b60ea65dd24e3f81a4c510fa273.jpg" />
          <p> 4 Donec a fermentum nisi. Integer dolor est, commodo ut sagittis vitae, egestas at augue. </p>
        </div>

        <div class="item">
          <img src="https://imgsa.baidu.com/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=9fe1d71697ef76c6c4dff379fc7f969f/b03533fa828ba61ed2efcd184634970a304e5987.jpg" />
          <p> 5 Donec a fermentum nisi. Integer dolor est, commodo ut sagittis vitae, egestas at augue.</p>
        </div>
      </div>
    </div>
  );
});
