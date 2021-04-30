import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "author",
})
export class AuthorPipe implements PipeTransform {
    transform(value: string, arg: string[]): unknown {
        return value.substr(0, value.indexOf(arg[0]) - 1);
    }
}
