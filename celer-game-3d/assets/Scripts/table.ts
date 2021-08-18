/**
* 导出表自动生成的表数据声明
*/
    /** en的文本内容类型*/
    export enum En_ID{
        /** 免费暂停 */
        MianFeiZanTing = 1,
        /** 暂停扣分 */
        ZanTingKouFen = 2,
        /** 帮助页面1 */
        BangZhuYeMian1 = 3,
        /** 帮助页面2 */
        BangZhuYeMian2 = 4,
        /** 帮助页面3 */
        BangZhuYeMian3 = 5,
        /** 帮助页面4 */
        BangZhuYeMian4 = 6,
        /** 帮助页面5 */
        BangZhuYeMian5 = 7,
        /** 帮助页面6 */
        BangZhuYeMian6 = 8,
        /** 帮助页面7 */
        BangZhuYeMian7 = 9,
        /** 帮助页面8 */
        BangZhuYeMian8 = 10,
        /** 帮助页面9 */
        BangZhuYeMian9 = 11,
        /** 帮助页面10 */
        BangZhuYeMian10 = 12,
        /** 帮助页面11 */
        BangZhuYeMian11 = 13,
        /** 帮助界面特殊玩法 */
        BangZhuJieMianTeShuWanFa = 14,
        /** 免费打地鼠 */
        MianFeiDaDiShu = 15,
        /** 看广告失败 */
        KanGuangGaoShiBai = 16,
        /** 免费自由球 */
        MianFeiZiYouQiu = 17,
        /** 得分 */
        DeFen = 18,
        /** 道具使用提示 */
        DaoJuShiYongTiShi = 19,
        /** 魔法球提示 */
        MoFaQiuTiShi = 20,
        /** BonusParty */
        BonusParty = 21,
        /** 指引1 */
        ZhiYin1 = 22,
        /** 指引2 */
        ZhiYin2 = 23,
        /** 指引3 */
        ZhiYin3 = 24,
        /** 指引4 */
        ZhiYin4 = 25,
        /** 指引5 */
        ZhiYin5 = 26,
        /** 指引6 */
        ZhiYin6 = 27,
        /** 指引7 */
        ZhiYin7 = 28,
    };

    /** en的界面*/
    export enum En_View{
        /** 暂停界面 */
        ZanTingJieMian = 1,
        /** 帮助界面 */
        BangZhuJieMian = 2,
        /** 广告界面 */
        GuangGaoJieMian = 3,
        /** 结算界面 */
        JieSuanJieMian = 4,
        /** 提示条 */
        TiShiTiao = 5,
        /** 新手指引 */
        XinShouZhiYin = 6,
    };

    /** Physical的材质*/
    export enum Physical_ID{
        /** 球 */
        Qiu = 100,
        /** 桌面 */
        ZhuoMian = 101,
        /** 球杆 */
        QiuGan = 102,
        /** 桌板 */
        ZhuoBan = 103,
    };




    /** 表 En数据结构 */
    export interface En {
        /** 文本内容类型 */
        ID:number;
        /** 界面 */
        View:number;
        /** 内容 */
        Text:string;
        /** 字号 */
        FontSize:number;
        /** 行距 */
        LineHeight:number;
        /** 最大宽度 */
        MaxWidth:number;
        /** 水平 */
        Horizontal:number;
        /** 垂直 */
        Vertical:number;
        /** 横坐标 */
        X:number;
        /** 纵坐标 */
        Y:number;
    };

    /** 表 Physical数据结构 */
    export interface Physical {
        /** 材质 */
        ID:number;
        /** 摩擦系数 */
        Friction:number;
        /** 回弹系数 */
        Restitution:number;
        /** 滚动摩擦 */
        RollingFriction:number;
        /** 旋转摩擦 */
        SpinningFriction:number;
    };

