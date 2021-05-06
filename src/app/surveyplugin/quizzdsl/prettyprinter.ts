import { Result, Success } from "./genericcombinatorialparser";
import {
    Barrating,
    BooleanEntry,
    Checkboxes,
    CKEditor,
    Datepicker,
    Dropdown,
    Email,
    EmotionsRatings,
    File,
    Html,
    ImagePicker,
    IPaddress,
    matcher,
    Multipletext,
    Nouislider,
    PageSeparator,
    Question,
    QuestionSeparator,
    Radio,
    Rating,
    Sentence,
    SignaturePad,
    SortableJS,
    StaticImage,
    Text,
    UML,
} from "./model";
import { quizzdsl } from "./quizzdsl";

class StringIdGenerator {
    nextId = [0];
    constructor(private chars: string = "abcdefghijklmnopqrstuvwxyz") {}

    next() {
        const r = [];
        for (const char of this.nextId) {
            r.unshift(this.chars[char]);
        }
        this._increment();
        return r.join("");
    }

    _increment() {
        for (let i = 0; i < this.nextId.length; i++) {
            const val = ++this.nextId[i];
            if (val >= this.chars.length) {
                this.nextId[i] = 0;
            } else {
                return;
            }
        }
        this.nextId.push(0);
    }

    *[Symbol.iterator]() {
        while (true) {
            yield this.next();
        }
    }
}

export class SuerveyJSPrinter {
    questionNumber = 0;
    choiceLetter = new StringIdGenerator();
    isChoice = false;
    isImage = false;
    isMultipleItem = false;
    numberquestion = 0;
    isSimpleChoice = false;
    isRating = false;
    isText = false;
    constructor(
        private titre: string,
        private showphotocapture: boolean,
        private consigne: string,
        private tmpsenseconde: number,
        private questionsOrder?: string,
        private choicesOrder?: string,
        private completedhtml?: string,
        private startSurveyText?: string,
        private locale?: string
    ) {}

    printer = matcher<string>({
        Text: (t) => this.visitText(t),
        Radio: (t) => this.visitRadio(t),
        Dropdown: (t) => this.visitDropdown(t),
        Checkboxes: (t) => this.visitCheckboxes(t),
        ImagePicker: (t) => this.visitImagePicker(t),
        BooleanEntry: (t) => this.visitBooleanEntry(t),
        SignaturePad: (t) => this.visitSignaturePad(t),
        Multipletext: (t) => this.visitMultipletext(t),
        Rating: (t) => this.visitRating(t),
        StaticImage: (t) => this.visitStaticImage(t),
        Html: (t) => this.visitHtml(t),
        File: (t) => this.visitFile(t),
        Datepicker: (t) => this.visitDatepicker(t),
        Barrating: (t) => this.visitBarrating(t),
        SortableJS: (t) => this.visitSortableJS(t),
        Nouislider: (t) => this.visitNouislider(t),
        IPaddress: (t) => this.visitIPaddress(t),
        Email: (t) => this.visitEmail(t),
        CKEditor: (t) => this.visitCKEditor(t),
        EmotionsRatings: (t) => this.visitEmotionsRatings(t),
        UML: (t) => this.visitUML(t),
        Question: (q) => this.visitQuestion(q),
        QuestionSeparator: (s) => this.visitQuestionSeparator(s),
        PageSeparator: (s) => this.visitPageSeparator(s),
    });
    print(res: string): string {
        return this.printParse(
            quizzdsl({
                text: res,
                index: 0,
            })
        );
    }

    private printParse(res: Result<Sentence[][]>): string {
        let result = "";
        if (res.success) {
            const t = res as Success<Sentence[][]>;
            result = `var exam = {
      "locale": "${this.locale}",
      "title" : "${this.titre}",
      "showProgressBar": "bottom",
      "showTimerPanel": "top",
      "maxTimeToFinish": "${this.tmpsenseconde}",
      "firstPageIsStarted": true,
      "startSurveyText": "${this.startSurveyText}",
      "questionsOrder": "${this.questionsOrder}",
      "completedHtml": "${this.completedhtml}",
      "pages": [
        {
          "questions": [
            {
              "type": "html",
              "html": \`${this.consigne}\`
          }`;
            if (this.showphotocapture) {
                result =
                    result +
                    `,
        {
          "name": "photo",
          "type": "photocapture",
          "title": "Prenez une jolie photo que l' on sache que c'est vous",
          "isRequired:": true
      }`;
            }
            result =
                result +
                `]
  },
  {
    "questionsOrder": "${this.questionsOrder}",
    "questions": [`;
            t.value.forEach((t1, index1) => {
                t1.forEach((t2, index2) => {
                    if (
                        !(
                            index1 === t.value.length - 1 &&
                            index2 === t1.length - 1
                        )
                    ) {
                        result = result + this.printer(t2);
                    } else {
                        result =
                            result +
                            `]
        }
        ]
        }
      ]
    }`;
                    }
                });
            });
            result = result + "\n JSON.stringify(exam);";
        }
        return result;
    }

    private visitText(t: Text): string {
        this.isText = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "text",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
placeHolder : `;
    }
    private visitRadio(t: Radio): string {
        this.isChoice = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
  "type": "radiogroup",
  "isRequired": false,
  "choicesOrder": "${this.choicesOrder}",
  "showClearButton": true,
  "showQuestionNumbers": true,
  "name": "Q${this.questionNumber}",
  "title": \`${desc}\`,
  "choices": [
  `;
    }
    private visitDropdown(t: Dropdown): string {
        this.isChoice = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
  "type": "dropdown",
  "isRequired": false,
  "choicesOrder": "${this.choicesOrder}",
  "showClearButton": true,
  "showQuestionNumbers": true,
  "name": "Q${this.questionNumber}",
  "title": \`${desc}\`,
  "choices": [
  `;
    }

    private visitCheckboxes(t: Checkboxes): string {
        this.isChoice = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "checkbox",
"isRequired": false,
"choicesOrder": "${this.choicesOrder}",
"showClearButton": true,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"choices": [
`;
    }
    private visitImagePicker(t: ImagePicker): string {
        this.isChoice = true;
        this.isImage = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
  "type": "imagepicker",
  "isRequired": false,
  "choicesOrder": "${this.choicesOrder}",
  "showClearButton": true,
  "showQuestionNumbers": true,
  "imageWidth":500,
  "imageHeight": 500,
  "name": "Q${this.questionNumber}",
  "title": \`${desc}\`,
  "choices": [
  `;
    }
    private visitBooleanEntry(t: BooleanEntry): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "boolean",
"isRequired": false,
"showClearButton": true,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"ignores" : [ `;
    }
    private visitSignaturePad(t: SignaturePad): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "signaturepad",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"ignores" : [`;
    }
    private visitMultipletext(t: Multipletext): string {
        this.isChoice = true;
        this.isMultipleItem = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "multipletext",
"isRequired": false,
"showClearButton": true,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"items": [
`;
    }
    private visitRating(t: Rating): string {
        this.isRating = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "rating",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"minRateDescription": `;
    }
    private visitStaticImage(t: StaticImage): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        return `{
"type": "image",
"isRequired": false,
"imageWidth": "500px",
"imageHeight": "300px",
"imageLink": \`${desc}\`,
"ignores" : [`;
    }

    private visitHtml(t: Html): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        return `{
"type": "html",
"isRequired": false,
"html": \`${desc}\`,
"ignores" : [`;
    }
    private visitFile(t: File): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        this.questionNumber = this.questionNumber + 1;

        return `{
"type": "file",
"isRequired": false,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"storeDataAsText": true,
"showPreview": true,
"maxSize": 1024000,
"ignore" : [`;
    }
    private visitDatepicker(t: Datepicker): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        this.questionNumber = this.questionNumber + 1;

        return `{
"type": "datepicker",
"isRequired": false,
"inputType": "date",
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"dateFormat": "mm/dd/yy",
"ignores" : [`;
    }
    private visitBarrating(t: Barrating): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        this.questionNumber = this.questionNumber + 1;

        return `{
"type": "barrating",
"isRequired": false,
"ratingTheme": "fontawesome-stars",
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"choices": [ `;
    }
    private visitSortableJS(t: SortableJS): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        this.questionNumber = this.questionNumber + 1;

        return `{
"type": "sortablelist",
"isRequired": false,
"choicesOrder": "${this.choicesOrder}",
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"choices": [ `;
    }
    private visitNouislider(t: Nouislider): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "nouislider",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"ignores" : [`;
    }
    private visitIPaddress(t: IPaddress): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "text",
"inputMask": "ip",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"ignores" : [`;
    }
    private visitEmail(t: Email): string {
        this.isChoice = true;
        this.isSimpleChoice = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "text",
"inputMask": "email",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"ignores": [`;
    }
    private visitCKEditor(t: CKEditor): string {
        this.isChoice = true;
        this.isSimpleChoice = true;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "editor",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"ignores": [`;
    }
    private visitEmotionsRatings(t: EmotionsRatings): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        this.questionNumber = this.questionNumber + 1;

        return `{
"type": "emotionsratings",
"isRequired": false,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"choices": [ `;
    }
    private visitUML(t: UML): string {
        this.isChoice = true;
        this.isSimpleChoice = true;

        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");

        this.questionNumber = this.questionNumber + 1;
        return `{
"type": "uml",
"isRequired": false,
"showQuestionNumbers": true,
"name": "Q${this.questionNumber}",
"title": \`${desc}\`,
"ignores" : [`;
    }
    private visitQuestion(t: Question): string {
        this.numberquestion = this.numberquestion + 1;
        const find = "`";
        const re = new RegExp(find, "g");
        const desc = t.desc.replace(re, "\\`");
        let res = "";
        let comma = "";
        if (this.isChoice) {
            if (this.isImage) {
                res = `{
        "value": "${this.choiceLetter.next()}",
        "imageLink": \`${desc}\`
        }
        `;
            } else if (this.isMultipleItem) {
                res = `{
          "name": "${this.choiceLetter.next()}",
          "title": \`${desc}\`
          }
          `;
            } else if (this.isSimpleChoice) {
                res = `\`${desc}\``;
            } else {
                res = `{
          "value": "${this.choiceLetter.next()}",
          "text": \`${desc}\`
          }
          `;
            }
        } else {
            if (this.isRating) {
                if (t.last) {
                    res = `"maxRateDescription": \`${desc}\``;
                } else {
                    res = `\`${desc}\`\n`;
                }
            } else if (this.isText) {
                if (t.last) {
                    res = `\`${desc}\``;
                }
            } else {
                res = `\`${desc}\`\n`;
            }
        }
        if (!t.last && !this.isText) {
            comma = ",\n";
        } else {
            this.choiceLetter = new StringIdGenerator();
        }

        return res + comma;
    }
    private visitQuestionSeparator(t: QuestionSeparator): string {
        let colcount = "";
        if (this.isMultipleItem) {
            colcount = `,\ncolCount: ${this.numberquestion}\n`;
        }
        this.numberquestion = 0;
        this.isRating = false;
        this.isText = false;

        if (this.isChoice) {
            this.isChoice = false;
            this.isImage = false;
            this.isMultipleItem = false;
            this.isSimpleChoice = false;

            return "] " + colcount + "},";
        } else {
            return "},";
        }
    }
    private visitPageSeparator(t: PageSeparator): string {
        let colcount = "";
        if (this.isMultipleItem) {
            colcount = `,\ncolCount: ${this.numberquestion}\n`;
        }
        const res = `
  }
  ]
  },
  {
    "questionsOrder": "${this.questionsOrder}",
    "questions":
      [`;

        this.numberquestion = 0;
        this.isRating = false;
        this.isText = false;

        if (this.isChoice) {
            this.isChoice = false;
            this.isImage = false;
            this.isMultipleItem = false;
            this.isSimpleChoice = false;

            return "]" + colcount + res;
        } else {
            return res;
        }
    }
}
