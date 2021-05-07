interface Grid {
  i: number;
  j: number;
}

export const GridRange = {
  i: {
    max: 11,
    min: 0,
  },
  j: {
    max: 8,
    min: 0,
  },
};

export class GridUtil {
  public static copyGrid(origin: Grid) {
    return {
      i: origin.i,
      j: origin.j,
    };
  }

  /** 获取水平 */
  public static GetHorizontalWayByOrigin(origin: Grid): Grid[] {
    let res: Grid[] = [];

    let left: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (--left.j >= GridRange.j.min) {
      res.push(this.copyGrid(left));
    }

    let right: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (++right.j <= GridRange.j.max) {
      res.push(this.copyGrid(right));
    }

    return res;
  }

  /** 获取竖直 */
  public static GetVerticalWayByOrigin(origin: Grid): Grid[] {
    let res: Grid[] = [];

    let top: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (++top.i <= GridRange.i.max) {
      res.push(this.copyGrid(top));
    }

    let bot: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (--bot.i >= GridRange.i.min) {
      res.push(this.copyGrid(bot));
    }

    return res;
  }

  /** 获取对角线 */
  public static GetDiagonalWayByOrigin(origin: Grid): Grid[] {
    let res: Grid[] = [];

    let leftTop: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (++leftTop.i <= GridRange.i.max && --leftTop.j >= GridRange.j.min) {
      res.push(this.copyGrid(leftTop));
    }

    let rightTop: Grid = {
      i: origin.i,
      j: origin.j,
    };
    while (++rightTop.i <= GridRange.i.max && ++rightTop.j <= GridRange.j.max) {
      res.push(this.copyGrid(rightTop));
    }

    let leftBot: Grid = {
      i: origin.i,
      j: origin.j,
    };
    while (--leftBot.i >= GridRange.i.min && --leftBot.j >= GridRange.j.min) {
      res.push(this.copyGrid(leftBot));
    }

    let rightBot: Grid = {
      i: origin.i,
      j: origin.j,
    };
    while (--rightBot.i >= GridRange.i.min && ++rightBot.j <= GridRange.j.max) {
      res.push(this.copyGrid(rightBot));
    }

    return res;
  }

  /** 获取九宫格 */
  public static GetSquaredWayByOrigin(origin: Grid): Grid[] {
    let res: Grid[] = [];

    // 对角
    let leftTop: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (++leftTop.i <= GridRange.i.max && --leftTop.j >= GridRange.j.min) {
      res.push(this.copyGrid(leftTop));
      break;
    }

    let rightTop: Grid = {
      i: origin.i,
      j: origin.j,
    };
    while (++rightTop.i <= GridRange.i.max && ++rightTop.j <= GridRange.j.max) {
      res.push(this.copyGrid(rightTop));
      break;
    }

    let leftBot: Grid = {
      i: origin.i,
      j: origin.j,
    };
    while (--leftBot.i >= GridRange.i.min && --leftBot.j >= GridRange.j.min) {
      res.push(this.copyGrid(leftBot));
      break;
    }

    let rightBot: Grid = {
      i: origin.i,
      j: origin.j,
    };
    while (--rightBot.i >= GridRange.i.min && ++rightBot.j <= GridRange.j.max) {
      res.push(this.copyGrid(rightBot));

      break;
    }

    // 竖直
    let top: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (++top.j <= GridRange.j.max) {
      res.push(this.copyGrid(top));

      break;
    }

    let bot: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (--bot.j >= GridRange.j.min) {
      res.push(this.copyGrid(bot));

      break;
    }

    // 水平
    let left: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (--left.i >= GridRange.i.min) {
      res.push(this.copyGrid(left));

      break;
    }

    let right: Grid = {
      i: origin.i,
      j: origin.j,
    };

    while (++right.i <= GridRange.i.max) {
      res.push(this.copyGrid(right));

      break;
    }

    return res;
  }
}
