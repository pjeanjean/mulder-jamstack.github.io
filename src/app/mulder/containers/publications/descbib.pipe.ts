import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "descbib",
})
export class DescbibPipe implements PipeTransform {
    transform(value: string, arg: string[]): unknown {
        const res = value.substr(value.indexOf(arg[0]) + arg[0].length + 2);
        return res.substring(0, res.indexOf("&#x27E8") - 2) + ".";
    }
}
