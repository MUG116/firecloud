let codes = [];
let num = 0;
const btn = document.createElement('button');
btn.style.opacity = 0;
btn.style.width = '140px';
btn.style.height = '40px';
btn.style.position = 'fixed';
btn.style.bottom = '0px';
btn.style.left = '0px';
btn.style.zIndex = '999';
btn.addEventListener('click',()=>{
    navigator.clipboard.writeText(codes[num]);
});
document.body.appendChild(btn);
function setCopy(i){
    num = i;
}
codes.push(`//2-1
Laya.Scene.load('./mainScene.json', Laya.Handler.create(null, (res: Laya.Scene) => {
    this.mainScene = res;
    const sceneUrl = 'Scene3D/LayaScene/Convention/NAV_Object.ls';
    Laya.Scene3D.load(sceneUrl, Laya.Handler.create(null, (res: Laya.Scene3D) => {
        res.name = 'root 3d scene';
        this.scene3D = res;
        Laya.stage.addChildAt(this.scene3D, 0);
        this.mainCamera = this.scene3D.getChildByName('Camera') as Laya.Camera;
        if (!this.mainCamera) {
            this.mainCamera = this.scene3D.getChildByName('Main Camera') as Laya.Camera;
        }
        if (!this.mainCamera) {
            this.mainCamera = new Laya.Camera();
            this.scene3D.addChild(this.mainCamera);
        }
        this.mainCamera.enableHDR = true;
        this.mainCamera.clearColor = new Laya.Vector4(0, 0, 0, 255);
        this.mainCamera.clearFlag = Laya.CameraClearFlags.SolidColor;
        this.mainCamera.fieldOfView = 66;
        this.mainCamera.depthTextureMode = Laya.DepthTextureMode.None;
        console.log('[ar competition] 初始化3D主场景');
        this.ARSDKinit();
    }))
}))`);
codes.push(`//2-2
window.ARSDK.init({
    appKey: '',
    encryptDataStr: '',
    tenantId: '',
    requestDomain: '',
    requestRealDomain: '',
    locationBaseUrl: '',
    regionsCode: ''
}).then(async () => {
    window.ARSDK.Laya2.config(this.scene3D, this.mainCamera);
    console.log('[ar competition] after update config', window.ARSDK.getConfig());
})`);
codes.push(`//2-3
onResponseFilter: (poiRecords)=>{
  poiRecords.forEach((item)=>{
    window.ARSDK.POI.showPoi(item.poiId);
  });
  return [];
},
onClick(event){
  console.log('[ar competition] poi on click', event);
  window.ARSDK.POI.hidePoi(event.poiConfig.poiId, true).then(()=>{});
}`);
codes.push(`//3-1
console.log("[ar competition] poiRecord first", poiRecords[0]);
poiFirst.value = poiRecords[0];`);
codes.push(`//3-2
const { position, poiId } = record;
const ypoInstance = Laya.Sprite3D.instantiate(ybo as Laya.Sprite3D);
const { scene } = window.ARSDK.Laya2.getScene();
ypoInstance.transform.position = new Laya.Vector3(
  -position.x,
  position.y,
  position.z
);
ypoInstance.name = \`POI_Loading-\${poiId}\`;
ypoInstance.transform.localScale = new Laya.Vector3(2, 2, 2);
scene.addChild(ypoInstance);//
ypoInstance.active = true;
console.log("[ar competition] ypoInstance", ypoInstance);`);
codes.push(`//3-3
const visibleRange = poiFirst.value.visibleRange;
const positionB = poiFirst.value.position;
function calculateDistance(
  positionA: { x: number; y: number; z: number },
  positionB: { x: number; y: number; z: number }
) {
  const dx = positionA.x - positionB.x;
  const dy = positionA.y - positionB.y;
  const dz = positionA.z - positionB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
const distance = calculateDistance(positionA, positionB);
console.log("[ar competition] visibleRange", visibleRange);
console.log("[ar competition] distance", distance);`);
codes.push(`//4-1 A
const resPathList: Array<any> = [this.boardUrl, this.redPackage];
Laya.loader.create(resPathList, Handler.create(this, this.initGameControl));`);
codes.push(`//4-1 B
const { scene } = window.ARSDK.Laya2.getScene();
this.resouceA3D = Sprite3D.instantiate(
  Laya.loader.getRes(this.boardUrl)
) as Sprite3D;
this.resouceA3D.transform.position = new Vector3(-8, 0, -3);
scene.addChild(this.resouceA3D);
this.resouceAScript = this.resouceA3D.addComponent(
  ResourceAScript
) as ResourceAScript;
this.resouceB3D = Sprite3D.instantiate(
  Laya.loader.getRes(this.redPackage)
) as Sprite3D;
this.resouceB3D.transform.position = new Vector3(-8, 2, -3);
scene.addChild(this.resouceB3D);
this.resouceBScript = this.resouceB3D.addComponent(
  ResourceBScript
) as ResourceBScript;
this.onSetGameControl();
this.resouceAScript.draw(this.resouceA3D);
console.log('[ar competition] resourceA:', this.resouceA3D);
console.log('[ar competition] resourceB:', this.resouceB3D);`);
codes.push(`//4-2
import Vector3 = Laya.Vector3;
import Sprite3D = Laya.Sprite3D;
import MeshSprite3D = Laya.MeshSprite3D;
import Texture2D = Laya.Texture2D;
import EventDispatcher = Laya.EventDispatcher;
import Event = Laya.Event;

export default class ResourceAScript extends Laya.Script {
  private notificationBar3D!: Sprite3D;
  private aText!: string;
  public drawComplete: EventDispatcher = new EventDispatcher();
  private textPad!: MeshSprite3D;

  private width: number = 2000;
  private height: number = 400;
  private font = '200px RedEnvelopeFonts';
  private fontColor = '#fae672';

  private cav: any;
  private cxt: any;
  private texture2D: any;
  private mat: any;

  constructor() {
    super();
    this.aText = '绘图功能';
  }

  public draw(resouceA3D: Sprite3D): void {
    this.notificationBar3D = resouceA3D;
    const aBackground = resouceA3D.getChildByName(
      'Mod_TexMesh'
    ) as MeshSprite3D;
    if (aBackground) {
      this.textPad = aBackground;

      this.cav = Laya.Browser.createElement('canvas');
      this.cxt = this.cav.getContext('2d');

      this.texture2D = new Texture2D(this.cav.width, this.cav.height);

      this.mat = new Laya.UnlitMaterial();
      this.textPad.meshRenderer.sharedMaterial = this.mat;
    }

    if (this.textPad) {
      this.drawCanvas(this.aText, this.textPad);
    }
  }

  private drawCanvas(text: string, meshSprite: MeshSprite3D): void {
    this.cxt.clearRect(0, 0, this.cav.width, this.cav.height);

    this.cav.width = this.width;
    this.cav.height = this.height;

    this.cxt.fillStyle = 'rgba(255, 255, 255, 0)';
    this.cxt.fillRect(0, 0, this.cav.width, this.cav.height);

    this.cxt.textAlign = 'center';
    this.cxt.textBaseline = 'center';

    this.cxt.lineWidth = 0;
    this.cxt.font = this.font;

    this.cxt.fillStyle = this.fontColor;
    this.cxt.strokeText(text, this.cav.width / 2, this.cav.height / 2 + 90);
    this.cxt.fillText(text, this.cav.width / 2, this.cav.height / 2 + 90);

    this.texture2D.loadImageSource(this.cav);
    this.mat.renderMode = Laya.UnlitMaterial.RENDERMODE_TRANSPARENT;

    this.mat.albedoTexture = this.texture2D;
    (<Laya.BlinnPhongMaterial>meshSprite.meshRenderer.sharedMaterial).cull =
      Laya.RenderState.CULL_NONE;
    setTimeout(() => {
      this.drawComplete.event(Event.COMPLETE, this);
    }, 1000);
  }

  onDestroy() {
    this.notificationBar3D.destroy();
  }
}
`);
codes.push(`//4-3
import Vector3 = Laya.Vector3;
import Sprite3D = Laya.Sprite3D;
import Handler = Laya.Handler;
import Rigidbody3D = Laya.Rigidbody3D;

export default class RedEnvelopeControl extends Laya.Script {
  /** @prop {name:centerPointPosition, tips:"POI点", type:Vector}*/
  public centerPointPosition!: Vector3;

  public redEnvelopeSign = '3D_Red_Envelope';

  private redEnvelopeDrop3DList: Array<Sprite3D> = [];

  private _redEnvelopeRootNode!: Sprite3D;

  private redEnvelopeUrls: Array<string> = [];

  constructor() {
    super();
    this.centerPointPosition = new Vector3(-10, 3, 2);
  }

  onAwake(): void { }

  onStart() { }

  public onLoadedCompleted(aRedEnvelopeSprite3D: Sprite3D): void {
    /** 获取红包3D模型 */
    const rigidBody: Rigidbody3D = aRedEnvelopeSprite3D.getComponent(
      Rigidbody3D
    ) as Rigidbody3D;
    rigidBody.mass = 15;

    rigidBody.overrideGravity = true;
    rigidBody.gravity = new Vector3(0, 0, 0);

    rigidBody.linearVelocity = new Vector3(0, -1, 0);
    this.redEnvelopeDrop3DList.push(aRedEnvelopeSprite3D);

    this.startGame();
  }

  private startGame(): void {
    const { scene, camera } = window.ARSDK.Laya2.getScene();
    this._redEnvelopeRootNode = new Sprite3D('RedEnvelopeRoot');
    this._redEnvelopeRootNode = new Sprite3D('RedEnvelopeRoot');
    this.createRedEnvelope();
  }

  private createRedEnvelope() {
    const cloneRedEnvelope = this.getRedEnvelopeByPool() as Laya.Sprite3D;

    this._redEnvelopeRootNode.addChild(cloneRedEnvelope);
    cloneRedEnvelope.active = true;
    const aTransform3D = cloneRedEnvelope.transform;
    aTransform3D.position = this.randomRotation(this.centerPointPosition, 10);

    aTransform3D.rotate(
      new Vector3(
        this.random(0, 360),
        this.random(0, 360),
        this.random(0, 360)
      ),
      false,
      false
    );

    const rigidBody: Rigidbody3D = cloneRedEnvelope.getComponent(
      Rigidbody3D
    ) as Rigidbody3D;

    rigidBody.angularVelocity = new Vector3(
      this.randomFloat(0, 2) * this.randomPlusOrMinus(),
      this.randomFloat(0, 2) * this.randomPlusOrMinus(),
      this.randomFloat(0, 2) * this.randomPlusOrMinus()
    );
  }

  private getRedEnvelopeByPool() {
    let aRedEnvelope = Laya.Pool.getItem(this.redEnvelopeSign);
    if (!aRedEnvelope) {
      aRedEnvelope = Laya.Pool.getItemByCreateFun(
        this.redEnvelopeSign,
        this.createFun,
        this
      );
    }
    return aRedEnvelope;
  }

  private createFun() {
    return Sprite3D.instantiate(
      this.redEnvelopeDrop3DList[
      Math.floor(Math.random() * this.redEnvelopeDrop3DList.length)
      ]
    );
  }

  private randomRotation(point: Vector3, radius: number): Vector3 {
    return new Vector3(
      point.x + this.random(0, radius) * this.randomPlusOrMinus(),
      point.y,
      point.z + this.random(0, radius) * this.randomPlusOrMinus()
    );
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private randomPlusOrMinus(): number {
    return Math.random() < 0.5 ? -1 : 1;
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  onDestroy() {
    Laya.timer.clearAll(this);
    this.redEnvelopeDrop3DList.forEach((sp) => {
      sp && sp.destroy();
    });
  }
}
`);
codes.push(`4-4
this.resouceAScript.drawComplete.on(Event.COMPLETE, this, () => {
  this.resouceA3D.active = false;
  this.resouceBScript.onLoadedCompleted(this.resouceB3D);
});`);
console.log('[a.js] TOOL INJECTED');
codes.push(`该项目“ARCompetition”通过集成Unity和LayaAir3D技术，提供了一个全面的增强现实开发框架，其亮点在于多技术栈集成、自定义天空盒材质、ARSDK的深度应用、3D场景与模型的加载显示、POI资源管理、资源本地化加载与管理、资源可视距离判定以及资源批量加载与交互逻辑开发，展现了在创建跨平台、沉浸式AR体验方面的创新能力。`);
codes.push(`这个项目“ARCompetition”的未来改进方向可能包括进一步优化3D模型和场景的加载效率、增强AR交互的自然性和直观性、提升跨平台兼容性、集成更先进的AI技术以提升用户体验、以及探索5G等新技术在AR领域的应用，以期打造更加丰富和响应迅速的增强现实体验。`);
codes.push(`这个项目“ARCompetition”通过Unity和LayaAir3D技术集成，实现了3D场景和模型的创建与显示、自定义天空盒材质、利用XRStudio插件导出H5模型、ARSDK配置与地图部署、POI资源管理、资源本地化加载与管理、资源可视距离判定以及资源批量加载与交互逻辑开发等核心功能，构建了一个跨平台的增强现实应用框架。`);
codes.push(`在开发“ARCompetition”项目过程中，团队面临的挑战包括确保跨平台兼容性、优化性能、提升用户体验、技术集成、高质量内容创建、实时预览与调试、资源管理和网络数据同步等，而解决方案涉及使用Unity和LayaAir3D插件提高兼容性、优化3D资源加载、模块化开发以简化技术集成、利用Unity编辑器提升内容质量、LayaAir3D-Export Tool实现实时预览、智能资源管理和优化数据同步策略，以构建一个高效、稳定且用户友好的增强现实体验。`);
codes.push(`“ARCompetition”项目是一个利用Unity和LayaAir3D技术构建的增强现实应用，它通过集成XRStudio插件、ARSDK和自定义3D内容，实现了跨平台的3D场景展示、POI资源管理、模型导出和实时预览等功能，旨在提供一个高性能、用户友好的AR体验。`);
codes.push(`这个项目的技术支持方案主要基于Unity游戏引擎和LayaAir3D插件，结合XRStudio插件实现3D模型的H5格式导出，通过ARSDK实现增强现实功能，以及采用模块化开发方法来优化3D场景加载、POI资源管理和资源的本地化加载与管理，从而构建一个跨平台、高性能的AR应用框架。`);
