import {
  Animals_Type,
  Ball_Type,
  Books_Type,
  Buildings_Type,
  Food_Type,
  Makeup_Type,
  Ornament_Type,
  Other_Type,
  Outlet_Type,
} from "../table";

/** 物品种类显示 */
export const ItemSubType = {
  /** --------- 动物 ------------ */
  [Animals_Type.Gou]: "Dog",
  [Animals_Type.HuLi]: "Fox",
  [Animals_Type.Ji]: "Chicken",
  [Animals_Type.LaoShu]: "Rat",
  [Animals_Type.Ma]: "Horse",
  [Animals_Type.Mao]: "Cat",
  [Animals_Type.Niao]: "Bird",
  [Animals_Type.QingWa]: "Frog",
  [Animals_Type.She]: "Snake",
  [Animals_Type.Tu]: "Rabbit",
  [Animals_Type.WuGui]: "Tortoise",
  [Animals_Type.Ya]: "Duck",
  [Animals_Type.Yang]: "Sheep",
  [Animals_Type.Yu]: "Fish",
  [Animals_Type.Zhu]: "Pig",

  /** 服装类 */

  [Outlet_Type.TXu]: "T-shirt",
  [Outlet_Type.BeiXin]: "Vest",
  [Outlet_Type.ChenYi]: "Shirt",
  [Outlet_Type.DuanKu]: "Shorts",
  [Outlet_Type.MaoYi]: "Sweater",
  [Outlet_Type.PiXie]: "Leather\nShoes",
  [Outlet_Type.XueZi]: "Boots",
  [Outlet_Type.YuRongFu]: "Down\nJacket",
  [Outlet_Type.YunDongPaoXie]: "Sneakers",
  [Outlet_Type.ChangKu]: "Trousers",

  /** 干扰物品 */
  [Other_Type.GanRaoWuPin]: "Interfering\nItems",

  /** 化妆品 */
  [Makeup_Type.JingZi]: "Mirror",
  [Makeup_Type.KouHong]: "LipStick",
  [Makeup_Type.XiangShui]: "Perfume",
  [Makeup_Type.YanYingPan]: "Eyeshadow\nPalette",

  /** 建筑类 */
  [Buildings_Type.MingShengGuJi]: "Famous\nBuildings",

  /** 配饰类 */
  [Ornament_Type.ErHuan]: "Earring",
  [Ornament_Type.FaQia]: "Hairpin",
  [Ornament_Type.JieZhi]: "Ring",
  [Ornament_Type.MaoZi]: "Hat",
  [Ornament_Type.PiBao]: "Purses",
  [Ornament_Type.ShouBiao]: "Watch",
  [Ornament_Type.ShouHuan]: "Wristband",
  [Ornament_Type.SiJin]: "Silk\nScarf",
  [Ornament_Type.WaZi]: "Sock",
  [Ornament_Type.XiangLian]: "Necklace",

  /** 球类 */
  [Ball_Type.BangQiu]: "Baseball",
  [Ball_Type.BaoLingQiu]: "Bowling",
  [Ball_Type.GaoErFu]: "Golf",
  [Ball_Type.LanQiu]: "Basketball",
  [Ball_Type.PaiQiu]: "Volleyball",
  [Ball_Type.PingPangQiu]: "Pingpong",
  [Ball_Type.WangQiu]: "Tennis",
  [Ball_Type.YuMaoQiu]: "Badminton",
  [Ball_Type.ZuQiu]: "Football",

  /** 食物类 */
  [Food_Type.Dan]: "Egg",
  [Food_Type.DanGao]: "Cake",
  [Food_Type.GuanTou]: "Can",
  [Food_Type.GuoZhi]: "Fruit\nJuice",
  [Food_Type.HanBao]: "Hamburger",
  [Food_Type.KaFei]: "Coffee",
  [Food_Type.LengYin]: "Ice\nCream",
  [Food_Type.MianBao]: "Bread",
  [Food_Type.MianTiao]: "Noodles",
  [Food_Type.NiuNai]: "Milk",
  [Food_Type.PiSa]: "Pizza",
  [Food_Type.QiaoKeLi]: "Chocolate",
  [Food_Type.Rou]: "Meat",
  [Food_Type.SeLa]: "Salad",
  [Food_Type.ShouSi]: "Sushi",
  [Food_Type.TangGuo]: "Candy",
  [Food_Type.TianTianQuan]: "Donuts",
  [Food_Type.XiangChang]: "Sausage",
  [Food_Type.YinLiao]: "Pure\nWater",

  /** 书本 */
  [Books_Type.ShuBen]: "Book",
};
