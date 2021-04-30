import { HttpClient } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";

import {
    colorscale,
    Doc,
    PublicationResponse,
    stopWords,
} from "./publicationmodel";
@Component({
    selector: "mulder-publications",
    templateUrl: "./publications.component.html",
    styleUrls: ["./publications.component.scss"],
})
export class PublicationsComponent implements OnInit {
    docsPerYear: Map<number, Doc[]> = new Map();
    years: number[] = [];
    data: { text: any; value: number }[] = [];

    stopwords = stopWords;

    // Extracted from logo.svg
    // TODO: Word stemming to avoid having language and languages

    FONT = "Impact";

    TERM_COUNT = 20;
    large = 1;
    height = 1;
    innerWidth = window.innerWidth;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        const idhal = "olivierbarais";
        this.onResize({});

        this.http
            .get<PublicationResponse>(
                "https://api.archives-ouvertes.fr/search/?omitHeader=true&wt=json&q=authIdHal_s%3A%28" +
                    idhal +
                    "%29&sort=producedDate_s%20desc&rows=2000&fl=authFullName_s,title_s,producedDateY_i,label_s,citationFull_s,keyword_s,producedDateY_i,linkExtUrl_s,fileMain_s,description_s,halId_id,language_s,publicationDateY_i,publicationDateY_s,uri_s"
            )
            .subscribe((r) => {
                // tslint:disable-next-line:prettier
                // tslint:disable-next-line:no-unused-expression
                const d1: { text: any; value: number }[] = [];
                this.termCount(r.response.docs)
                    .slice(0, this.TERM_COUNT)
                    .forEach((e: any) => {
                        d1.push({ text: e.term, value: e.count * 10 });
                    });
                this.data = d1;
                r.response.docs.forEach((d) => {
                    // tslint:disable-next-line:no-unused-expression
                    if (!this.docsPerYear.has(d.publicationDateY_i)) {
                        this.docsPerYear.set(d.publicationDateY_i, []);
                    }
                    this.docsPerYear.get(d.publicationDateY_i)?.push(d);
                });
                this.years = Array.from(this.docsPerYear.keys());
            });
    }

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth > 1200) {
            this.large = 1000;
            this.height = 300;
        } else if (this.innerWidth > 992) {
            this.large = 700;
            this.height = 200;
        } else if (this.innerWidth > 550) {
            this.large = 500;
            this.height = 150;
        } else {
            this.large = this.innerWidth * 0.9;
            this.height = 150;
        }
    }

    terms(publications: Doc[]): string[] {
        const res: string[] = [];
        for (const pub of publications) {
            pub.keyword_s?.forEach((kw) => {
                kw.split(/\s+/)
                    .filter((x) => x && !this.stopwords.has(x))
                    .forEach((part) => {
                        res.push(part.toLowerCase());
                    });
            });
        }
        return res;
    }

    termCount(publications: Doc[]): any {
        const histogram: Map<string, number> = new Map();

        for (const term of this.terms(publications)) {
            histogram.set(
                term,
                ((histogram.has(term) ? histogram.get(term) : 0) as number) + 1
            );
        }

        const result = Array.from(histogram, ([key, value]) => {
            return { term: key, count: value };
        });
        result.sort((x, y) => y.count - x.count);
        return result;
    }

    public color(word: any, index: number): string {
        return colorscale[Math.round(Math.random() * colorscale.length)];
    }
}
