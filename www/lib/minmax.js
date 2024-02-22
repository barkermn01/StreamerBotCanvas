class MinMax{
    Min = 0;
    Max = 0;

    constructor(min, max){
        this.Min = min;
        this.Max = max;
    }

    GetValueInRange(){
        const vl = rndInt(this.Min, this.Max);
        return vl;
    }
}

MinMax.FromObject = (obj) => {
    return new MinMax(obj.Min, obj.Max)
}

MinMax.FromStatic = (num) => {
    return new MinMax(num, num)
}