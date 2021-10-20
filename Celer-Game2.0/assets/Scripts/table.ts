/**
* 导出表自动生成的表数据声明
*/
    /** en的文本内容类型*/
    export enum En_ID{
        /** 免费暂停 */
        MianFeiZanTing = 1,
        /** 暂停扣分 */
        ZanTingKouFen = 2,
        /** 得分 */
        DeFen = 4,
        /** 帮助页面1 */
        BangZhuYeMian1 = 100,
        /** 帮助页面2 */
        BangZhuYeMian2 = 101,
        /** 帮助页面3 */
        BangZhuYeMian3 = 102,
        /** undefined */
        undefined = 3,
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
        /** 新手指引 */
        XinShouZhiYin = 5,
        /** 击球点界面 */
        JiQiuDianJieMian = 6,
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

