/**
* 导出表自动生成的表数据声明
*/
    /** animals的种类*/
    export enum Animals_Type{
        /** 猫 */
        Mao = 101,
        /** 狗 */
        Gou = 102,
        /** 鸟 */
        Niao = 103,
        /** 猪 */
        Zhu = 104,
        /** 鱼 */
        Yu = 105,
        /** 乌龟 */
        WuGui = 106,
        /** 兔 */
        Tu = 107,
        /** 羊 */
        Yang = 108,
        /** 马 */
        Ma = 109,
        /** 蛇 */
        She = 1010,
        /** 鸡 */
        Ji = 1011,
        /** 鸭 */
        Ya = 1012,
        /** 青蛙 */
        QingWa = 1013,
        /** 狐狸 */
        HuLi = 1014,
        /** 老鼠 */
        LaoShu = 1015,
    };

    /** ball的种类*/
    export enum Ball_Type{
        /** 篮球 */
        LanQiu = 201,
        /** 羽毛球 */
        YuMaoQiu = 202,
        /** 乒乓球 */
        PingPangQiu = 203,
        /** 足球 */
        ZuQiu = 204,
        /** 排球 */
        PaiQiu = 206,
        /** 网球 */
        WangQiu = 207,
        /** 高尔夫 */
        GaoErFu = 208,
        /** 保龄球 */
        BaoLingQiu = 209,
        /** 棒球 */
        BangQiu = 2010,
    };

    /** books的种类*/
    export enum Books_Type{
        /** 书本 */
        ShuBen = 301,
    };

    /** buildings的种类*/
    export enum Buildings_Type{
        /** 名胜古迹 */
        MingShengGuJi = 401,
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

    /** en_US的ID*/
    export enum En_US_ID{
        /** 暂停描述一 */
        ZanTingMiaoShuYi = 1,
        /** 暂停描述二免费 */
        ZanTingMiaoShuErMianFei = 2,
        /** 暂停描述二扣分 */
        ZanTingMiaoShuErKouFen = 3,
    };

    /** en_US的界面*/
    export enum En_US_View{
        /** 暂停界面 */
        ZanTingJieMian = 1,
        /** 帮助界面 */
        BangZhuJieMian = 2,
        /** 新手指引 */
        XinShouZhiYin = 3,
    };

    /** food的种类*/
    export enum Food_Type{
        /** 披萨 */
        PiSa = 501,
        /** 面条 */
        MianTiao = 502,
        /** 蛋糕 */
        DanGao = 503,
        /** 甜甜圈 */
        TianTianQuan = 504,
        /** 寿司 */
        ShouSi = 505,
        /** 汉堡 */
        HanBao = 506,
        /** 面包 */
        MianBao = 507,
        /** 蛋 */
        Dan = 508,
        /** 牛奶 */
        NiuNai = 509,
        /** 果汁 */
        GuoZhi = 5010,
        /** 咖啡 */
        KaFei = 5011,
        /** 饮料 */
        YinLiao = 5012,
        /** 罐头 */
        GuanTou = 5013,
        /** 色拉 */
        SeLa = 5014,
        /** 肉 */
        Rou = 5015,
        /** 冷饮 */
        LengYin = 5016,
        /** 糖果 */
        TangGuo = 5017,
        /** 巧克力 */
        QiaoKeLi = 5018,
        /** 香肠 */
        XiangChang = 5019,
    };

    /** fruits的种类*/
    export enum Fruits_Type{
        /** 西瓜 */
        XiGua = 601,
        /** 苹果 */
        PingGuo = 602,
        /** 梨子 */
        LiZi = 603,
        /** 香蕉 */
        XiangJiao = 604,
        /** 猕猴桃 */
        MiHouTao = 605,
        /** 橙子 */
        ChengZi = 606,
        /** 葡萄 */
        PuTao = 607,
        /** 桃 */
        Tao = 608,
        /** 樱桃 */
        YingTao = 609,
        /** 菠萝 */
        BoLuo = 6010,
        /** 草莓 */
        CaoMei = 6011,
        /** 蓝莓 */
        LanMei = 6012,
        /** 柠檬 */
        NingMeng = 6013,
        /** 芒果 */
        MangGuo = 6014,
        /** 牛油果 */
        NiuYouGuo = 6015,
    };

    /** makeup的种类*/
    export enum Makeup_Type{
        /** 口红 */
        KouHong = 701,
        /** 镜子 */
        JingZi = 702,
        /** 眼影盘 */
        YanYingPan = 703,
        /** 香水 */
        XiangShui = 704,
    };

    /** ornament的种类*/
    export enum Ornament_Type{
        /** 手表 */
        ShouBiao = 801,
        /** 戒指 */
        JieZhi = 802,
        /** 耳环 */
        ErHuan = 803,
        /** 项链 */
        XiangLian = 804,
        /** 手环 */
        ShouHuan = 805,
        /** 皮包 */
        PiBao = 806,
        /** 丝巾 */
        SiJin = 807,
        /** 袜子 */
        WaZi = 808,
        /** 帽子 */
        MaoZi = 809,
        /** 发卡 */
        FaQia = 8010,
    };

    /** other的种类*/
    export enum Other_Type{
        /** 干扰物品 */
        GanRaoWuPin = 901,
    };

    /** outlet的种类*/
    export enum Outlet_Type{
        /** 背心 */
        BeiXin = 1001,
        /** T恤 */
        TXu = 1002,
        /** 衬衣 */
        ChenYi = 1003,
        /** 毛衣 */
        MaoYi = 1004,
        /** 羽绒服 */
        YuRongFu = 1005,
        /** 短裤 */
        DuanKu = 1006,
        /** 长裤 */
        ChangKu = 1007,
        /** 皮鞋 */
        PiXie = 1008,
        /** 运动跑鞋 */
        YunDongPaoXie = 1009,
        /** 靴子 */
        XueZi = 10010,
    };

    /** plants的种类*/
    export enum Plants_Type{
        /** 树叶 */
        ShuYe = 1101,
        /** 花朵 */
        HuaDuo = 1102,
        /** 花环 */
        HuaHuan = 1103,
        /** 仙人球盆栽 */
        XianRenQiuPenZai = 1104,
        /** 圣诞树 */
        ShengDanShu = 1105,
    };

    /** shape的种类*/
    export enum Shape_Type{
        /** 三角形 */
        SanJiaoXing = 1201,
        /** 正方形 */
        ZhengFangXing = 1202,
        /** 贝壳 */
        BeiKe = 1203,
        /** 爱心 */
        AiXin = 1204,
    };

    /** tool的种类*/
    export enum Tool_Type{
        /** 剪刀 */
        JianDao = 1301,
        /** 卷尺 */
        JuanChi = 1302,
        /** 书包 */
        ShuBao = 1303,
        /** 笔 */
        Bi = 1304,
        /** 地图 */
        DiTu = 1305,
        /** 上色画盘 */
        ShangSeHuaPan = 1306,
    };

    /** vegetable的种类*/
    export enum Vegetable_Type{
        /** 胡萝卜 */
        HuLuoBu = 1401,
        /** 豌豆 */
        WanDou = 1402,
        /** 南瓜 */
        NanGua = 1403,
        /** 甜椒 */
        TianJiao = 1404,
        /** 玉米 */
        YuMi = 1405,
        /** 洋葱 */
        YangCong = 1406,
        /** 土豆 */
        TuDou = 1407,
        /** 黄瓜 */
        HuangGua = 1408,
        /** 番茄 */
        FanQie = 1409,
        /** 蘑菇 */
        MoGu = 14010,
        /** 青花菜 */
        QingHuaCai = 14011,
        /** 茄子 */
        QieZi = 14012,
        /** 卷心菜 */
        JuanXinCai = 14013,
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

    /** 表 En_US数据结构 */
    export interface En_US {
        /** ID */
        ID:number;
        /** 界面 */
        View:number;
        /** 内容 */
        Text:string;
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

