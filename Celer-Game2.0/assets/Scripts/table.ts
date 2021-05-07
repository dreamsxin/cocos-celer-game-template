/**
* 导出表自动生成的表数据声明
*/
    /** Map1_1的类型*/
    export enum Map1_1_Type{
        /** 空 */
        Kong = 1,
        /** 普 */
        Pu = 2,
        /** 土 */
        Tu = 3,
        /** 石 */
        Shi = 4,
        /** 草 */
        Cao = 5,
    };

    /** Map1_2的类型*/
    export enum Map1_2_Type{
        /** 空 */
        Kong = 1,
        /** 普 */
        Pu = 2,
        /** 土 */
        Tu = 3,
        /** 石 */
        Shi = 4,
        /** 草 */
        Cao = 5,
    };

    /** Map2_1的类型*/
    export enum Map2_1_Type{
        /** 空 */
        Kong = 1,
        /** 普 */
        Pu = 2,
        /** 土 */
        Tu = 3,
        /** 石 */
        Shi = 4,
        /** 草 */
        Cao = 5,
    };

    /** Map2_2的类型*/
    export enum Map2_2_Type{
        /** 空 */
        Kong = 1,
        /** 普 */
        Pu = 2,
        /** 土 */
        Tu = 3,
        /** 石 */
        Shi = 4,
        /** 草 */
        Cao = 5,
    };

    /** Map3_1的类型*/
    export enum Map3_1_Type{
        /** 空 */
        Kong = 1,
        /** 普 */
        Pu = 2,
        /** 土 */
        Tu = 3,
        /** 石 */
        Shi = 4,
        /** 草 */
        Cao = 5,
    };

    /** Map3_2的类型*/
    export enum Map3_2_Type{
        /** 空 */
        Kong = 1,
        /** 普 */
        Pu = 2,
        /** 土 */
        Tu = 3,
        /** 石 */
        Shi = 4,
        /** 草 */
        Cao = 5,
    };




    /** 表 Level数据结构 */
    export interface Level {
        /** 等级 */
        ID:number;
        /** 随机 */
        Map:string[];
    };

    /** 表 Map1_1数据结构 */
    export interface Map1_1 {
        /** 行 */
        ID:number;
        /** 类型 */
        Type:number[];
        /** 金块总数量 */
        GoldCount:number;
    };

    /** 表 Map1_2数据结构 */
    export interface Map1_2 {
        /** 行 */
        ID:number;
        /** 类型 */
        Type:number[];
        /** 金块总数量 */
        GoldCount:number;
    };

    /** 表 Map2_1数据结构 */
    export interface Map2_1 {
        /** 行 */
        ID:number;
        /** 类型 */
        Type:number[];
        /** 金块总数量 */
        GoldCount:number;
    };

    /** 表 Map2_2数据结构 */
    export interface Map2_2 {
        /** 行 */
        ID:number;
        /** 类型 */
        Type:number[];
        /** 金块总数量 */
        GoldCount:number;
    };

    /** 表 Map3_1数据结构 */
    export interface Map3_1 {
        /** 行 */
        ID:number;
        /** 类型 */
        Type:number[];
        /** 金块总数量 */
        GoldCount:number;
    };

    /** 表 Map3_2数据结构 */
    export interface Map3_2 {
        /** 行 */
        ID:number;
        /** 类型 */
        Type:number[];
        /** 金块总数量 */
        GoldCount:number;
    };

