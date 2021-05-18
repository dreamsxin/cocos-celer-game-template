/**
* 导出表自动生成的表数据声明
*/
    /** animals的种类*/
    export enum Animals_Type{
        /** 猫 */
        Mao = 1,
        /** 狗 */
        Gou = 2,
        /** 鸟 */
        Niao = 3,
        /** 猪 */
        Zhu = 4,
        /** 鱼 */
        Yu = 5,
        /** 乌龟 */
        WuGui = 6,
        /** 兔 */
        Tu = 7,
        /** 羊 */
        Yang = 8,
        /** 马 */
        Ma = 9,
        /** 蛇 */
        She = 10,
        /** 鸡 */
        Ji = 11,
        /** 鸭 */
        Ya = 12,
        /** 青蛙 */
        QingWa = 13,
        /** 狐狸 */
        HuLi = 14,
        /** 老鼠 */
        LaoShu = 15,
    };

    /** ball的种类*/
    export enum Ball_Type{
        /** 篮球 */
        LanQiu = 1,
        /** 羽毛球 */
        YuMaoQiu = 2,
        /** 乒乓球 */
        PingPangQiu = 3,
        /** 足球 */
        ZuQiu = 4,
        /** 橄榄球 */
        GanLanQiu = 5,
        /** 排球 */
        PaiQiu = 6,
        /** 网球 */
        WangQiu = 7,
        /** 高尔夫 */
        GaoErFu = 8,
        /** 保龄球 */
        BaoLingQiu = 9,
        /** 棒球 */
        BangQiu = 10,
    };

    /** books的种类*/
    export enum Books_Type{
        /** 书本 */
        ShuBen = 1,
    };

    /** buildings的种类*/
    export enum Buildings_Type{
        /** 名胜古迹 */
        MingShengGuJi = 1,
    };

    /** class的种类*/
    export enum Class_Type{
        /** 动物类 */
        DongWuLei = 1,
        /** 植物类 */
        ZhiWuLei = 2,
        /** 建筑 */
        JianZhu = 3,
        /** 书本 */
        ShuBen = 4,
        /** 球 */
        Qiu = 5,
        /** 食物类 */
        ShiWuLei = 6,
        /** 形状 */
        XingZhuang = 7,
        /** 服装类 */
        FuZhuangLei = 8,
        /** 配饰 */
        PeiShi = 9,
        /** 文具工具 */
        WenJuGongJu = 10,
        /** 化妆品 */
        HuaZhuangPin = 11,
        /** 水果 */
        ShuiGuo = 12,
        /** 蔬菜 */
        ShuCai = 13,
        /** 干扰物品 */
        GanRaoWuPin = 14,
    };

    /** food的种类*/
    export enum Food_Type{
        /** 披萨 */
        PiSa = 1,
        /** 面条 */
        MianTiao = 2,
        /** 蛋糕 */
        DanGao = 3,
        /** 甜甜圈 */
        TianTianQuan = 4,
        /** 寿司 */
        ShouSi = 5,
        /** 汉堡 */
        HanBao = 6,
        /** 面包 */
        MianBao = 7,
        /** 蛋 */
        Dan = 8,
        /** 牛奶 */
        NiuNai = 9,
        /** 果汁 */
        GuoZhi = 10,
        /** 咖啡 */
        KaFei = 11,
        /** 饮料 */
        YinLiao = 12,
        /** 罐头 */
        GuanTou = 13,
        /** 色拉 */
        SeLa = 14,
        /** 肉 */
        Rou = 15,
        /** 冷饮 */
        LengYin = 16,
        /** 糖果 */
        TangGuo = 17,
        /** 巧克力 */
        QiaoKeLi = 18,
    };

    /** fruits的种类*/
    export enum Fruits_Type{
        /** 西瓜 */
        XiGua = 1,
        /** 苹果 */
        PingGuo = 2,
        /** 梨子 */
        LiZi = 3,
        /** 香蕉 */
        XiangJiao = 4,
        /** 猕猴桃 */
        MiHouTao = 5,
        /** 橙子 */
        ChengZi = 6,
        /** 葡萄 */
        PuTao = 7,
        /** 桃 */
        Tao = 8,
        /** 樱桃 */
        YingTao = 9,
        /** 菠萝 */
        BoLuo = 10,
        /** 草莓 */
        CaoMei = 11,
        /** 蓝莓 */
        LanMei = 12,
        /** 柠檬 */
        NingMeng = 13,
        /** 芒果 */
        MangGuo = 14,
        /** 牛油果 */
        NiuYouGuo = 15,
    };

    /** makeup的种类*/
    export enum Makeup_Type{
        /** 口红 */
        KouHong = 1,
        /** 镜子 */
        JingZi = 2,
        /** 眼影盘 */
        YanYingPan = 3,
        /** 香水 */
        XiangShui = 4,
    };

    /** ornament的种类*/
    export enum Ornament_Type{
        /** 手表 */
        ShouBiao = 1,
        /** 戒指 */
        JieZhi = 2,
        /** 耳环 */
        ErHuan = 3,
        /** 项链 */
        XiangLian = 4,
        /** 手环 */
        ShouHuan = 5,
        /** 皮包 */
        PiBao = 6,
        /** 丝巾 */
        SiJin = 7,
        /** 袜子 */
        WaZi = 8,
        /** 帽子 */
        MaoZi = 9,
        /** 发卡 */
        FaQia = 10,
    };

    /** other的种类*/
    export enum Other_Type{
        /** 干扰物品 */
        GanRaoWuPin = 1,
    };

    /** outlet的种类*/
    export enum Outlet_Type{
        /** 背心 */
        BeiXin = 1,
        /** T恤 */
        TXu = 2,
        /** 衬衣 */
        ChenYi = 3,
        /** 毛衣 */
        MaoYi = 4,
        /** 羽绒服 */
        YuRongFu = 5,
        /** 短裤 */
        DuanKu = 6,
        /** 长裤 */
        ChangKu = 7,
        /** 皮鞋 */
        PiXie = 8,
        /** 运动跑鞋 */
        YunDongPaoXie = 9,
        /** 靴子 */
        XueZi = 10,
    };

    /** plants的种类*/
    export enum Plants_Type{
        /** 树叶 */
        ShuYe = 1,
        /** 花朵 */
        HuaDuo = 2,
        /** 花环 */
        HuaHuan = 3,
        /** 仙人球盆栽 */
        XianRenQiuPenZai = 4,
        /** 圣诞树 */
        ShengDanShu = 5,
    };

    /** shape的种类*/
    export enum Shape_Type{
        /** 三角形 */
        SanJiaoXing = 1,
        /** 正方形 */
        ZhengFangXing = 2,
        /** 贝壳 */
        BeiKe = 3,
    };

    /** tool的种类*/
    export enum Tool_Type{
        /** 剪刀 */
        JianDao = 1,
        /** 卷尺 */
        JuanChi = 2,
        /** 书包 */
        ShuBao = 3,
        /** 笔 */
        Bi = 4,
        /** 地图 */
        DiTu = 5,
        /** 上色画盘 */
        ShangSeHuaPan = 6,
    };

    /** vegetable的种类*/
    export enum Vegetable_Type{
        /** 胡萝卜 */
        HuLuoBu = 1,
        /** 豌豆 */
        WanDou = 2,
        /** 南瓜 */
        NanGua = 3,
        /** 甜椒 */
        TianJiao = 4,
        /** 玉米 */
        YuMi = 5,
        /** 洋葱 */
        YangCong = 6,
        /** 土豆 */
        TuDou = 7,
        /** 黄瓜 */
        HuangGua = 8,
        /** 番茄 */
        FanQie = 9,
        /** 蘑菇 */
        MoGu = 10,
        /** 青花菜 */
        QingHuaCai = 11,
        /** 茄子 */
        QieZi = 12,
        /** 卷心菜 */
        JuanXinCai = 13,
    };




    /** 表 Animals数据结构 */
    export interface Animals {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Ball数据结构 */
    export interface Ball {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Books数据结构 */
    export interface Books {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Buildings数据结构 */
    export interface Buildings {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Class数据结构 */
    export interface Class {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 表名 */
        Table:string;
    };

    /** 表 Food数据结构 */
    export interface Food {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Fruits数据结构 */
    export interface Fruits {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Makeup数据结构 */
    export interface Makeup {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Ornament数据结构 */
    export interface Ornament {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Other数据结构 */
    export interface Other {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Outlet数据结构 */
    export interface Outlet {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Plants数据结构 */
    export interface Plants {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Shape数据结构 */
    export interface Shape {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Tool数据结构 */
    export interface Tool {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

    /** 表 Vegetable数据结构 */
    export interface Vegetable {
        /** ID */
        ID:number;
        /** 种类 */
        Type:number;
        /** 图集 */
        Icons:string[];
    };

