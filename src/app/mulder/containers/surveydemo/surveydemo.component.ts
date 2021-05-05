import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { SuerveyJSPrinter } from "@app/surveyplugin/quizzdsl/prettyprinter";

@Component({
    selector: "mulder-surveydemo",
    templateUrl: "./surveydemo.component.html",
    styleUrls: ["surveydemo.component.scss"],
})
export class SurveyDemoComponent implements OnInit, OnDestroy {
    json: any = {};
    private titre!: string;
    private consigne!: string;
    private tmpsenseconde: number;
    private questionsOrder?: string;
    private choicesOrder?: string;
    private pageOrder?: string;
    private completedhtml?: string;

    private httpOptions = {
        headers: new HttpHeaders({
            Accept: "text/html, application/xhtml+xml, */*",
        }),
        responseType: "text" as "json",
    };

    constructor(private http: HttpClient) {
        this.titre = "Examen 2020";
        this.consigne = "Demo of what you have to do";
        this.tmpsenseconde = 3600;
        this.questionsOrder = "random";
        this.choicesOrder = "random";
        this.pageOrder = "random";
        this.completedhtml =
            "<p><h4>Thanks for completing this form</h4></p>";


    }

    // canbesaved = true;

    shuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    ngOnInit(): void {
        const p = new SuerveyJSPrinter(
            this.titre,
            this.consigne,
            3600,
            this.questionsOrder,
            this.choicesOrder,
            this.completedhtml
        );
        this.http
            .get(
                "https://raw.githubusercontent.com/mulder-jamstack/mulder-jamstack.github.io/src/content/survey/demo.md",
                this.httpOptions
            )
            .subscribe((res) => {
                console.log(res);
                const s1 = p.print(res as string);

                const s = JSON.parse(eval(s1));

                // Random pages
                if (this.pageOrder === "random") {
                    const init = s.pages.shift();
                    this.shuffleArray(s.pages);
                    s.pages = [init, ...s.pages];
                }
                this.json = s;
                console.log(this.json);
            });
    }

    sendData(result: any) {
        console.log(result);
        /*const formData = new FormData();
        const dataStr = new Blob([JSON.stringify(result)], {
            type: "application/json",
        });
        // var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));

        formData.append("upload[]", dataStr, "result.json");

        this.http.post("/upload", formData).subscribe(
            (res: any) => {},
            (err: any) => {}
        );*/
    }

    sendFinalData(result: any) {
        console.log(result);
    }

    ngOnDestroy() {}
}
