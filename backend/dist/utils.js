"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakToBase2 = void 0;
const breakToBase2 = (num) => {
    const powers = [];
    let max = 1;
    while (num > 0) {
        if (num - max * 2 < 0) {
            powers.push(max);
            num -= max;
            max = 1;
            continue;
        }
        max *= 2;
    }
    return powers;
};
exports.breakToBase2 = breakToBase2;
//# sourceMappingURL=utils.js.map