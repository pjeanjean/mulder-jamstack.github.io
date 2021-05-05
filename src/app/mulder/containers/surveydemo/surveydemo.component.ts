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
        this.completedhtml = "<p><h4>Thanks for completing this form</h4></p>";
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
            this.tmpsenseconde,
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
                const s1 = p.print(res as string);

                const s = JSON.parse(eval(s1));

                // Random pages
                if (this.pageOrder === "random") {
                    const init = s.pages.shift();
                    this.shuffleArray(s.pages);
                    s.pages = [init, ...s.pages];
                }
                this.json = s;
            });
    }

    sendData(result: any) {
        console.log(result);
    }

    sendFinalData(result: any) {
        const options = {
            headers: new HttpHeaders().set("Content-Type", "text/plain"),
        };
        this.http
            .post(
                "https://script.google.com/macros/s/AKfycbyiSJmQJqg1tevvnuQEKR_kcQW4vekO88Z1z9fCN-1SLWIuogJr_ZXZ1w5m609ptXFPyQ/exec",
                result,
                options
            )
            .subscribe(
                (res: any) => {
                    console.log(res);
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    ngOnDestroy() {}
}
