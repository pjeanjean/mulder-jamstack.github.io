import * as parser from "./genericcombinatorialparser";
import * as model from "./model";
export function str2(
    beginmatch: string,
    nextToken: string[],
    f: (s: string, lasttokenval: string) => model.Sentence
): parser.Parser<model.Sentence> {
    return (ctx) => {
        const endIdx = ctx.index + beginmatch.length;
        if (ctx.text.substring(ctx.index, endIdx) === beginmatch) {
            let endIdx1 = -1;
            let tokenmatch = "";
            nextToken.forEach((t, i) => {
                const endIdx2 = ctx.text.indexOf(nextToken[i], endIdx);
                if (endIdx2 !== -1) {
                    if (endIdx1 === -1 || endIdx2 < endIdx1) {
                        endIdx1 = endIdx2;
                        tokenmatch = nextToken[i];
                    }
                }
            });

            const value = ctx.text.substring(endIdx + 1, endIdx1 - 1);
            return parser.success(
                { ...ctx, index: endIdx1 },
                f(value, tokenmatch)
            );
        } else {
            return parser.failure(ctx, beginmatch);
        }
    };
}

/* Text | Radio | Dropdown | Checkboxes |ImagePicker |BooleanEntry |
  SignaturePad | Multipletext | Rating | StaticImage | Html | File |
  Datepicker | Barrating  | SortableJS | Nouislider |IPaddress | Email |
  CKEditor | EmotionsRatings | UML |Question | QuestionSeparator | PageSeparator*/

const text = str2("# (t)", ["- [ ]"], (s) => new model.Text(s));
const radio = str2("# (r)", ["- [ ]"], (s) => new model.Radio(s));
const dropdown = str2("# (d)", ["- [ ]"], (s) => new model.Dropdown(s));
const checkboxes = str2("# (c)", ["- [ ]"], (s) => new model.Checkboxes(s));
const imagePicker = str2("# (i)", ["- [ ]"], (s) => new model.ImagePicker(s));
const booleanEntry = str2(
    "# (b)",
    ["- [ ]", "----", "---"],
    (s) => new model.BooleanEntry(s)
);
const signaturePad = str2(
    "# (si)",
    ["- [ ]", "----", "---"],
    (s) => new model.SignaturePad(s)
);
const multipletext = str2(
    "# (mt)",
    ["- [ ]"],
    (s) => new model.Multipletext(s)
);
const rating = str2("# (rating)", ["- [ ]"], (s) => new model.Rating(s));
const staticImage = str2(
    "# (statim)",
    ["- [ ]", "----", "---"],
    (s) => new model.StaticImage(s)
);
const html = str2(
    "# (htm)",
    ["- [ ]", "----", "---"],
    (s) => new model.Html(s)
);
const file = str2(
    "# (file)",
    ["- [ ]", "----", "---"],
    (s) => new model.File(s)
);
const datepicker = str2(
    "# (dp)",
    ["- [ ]", "----", "---"],
    (s) => new model.Datepicker(s)
);
const barrating = str2(
    "# (barrating)",
    ["- [ ]"],
    (s) => new model.Barrating(s)
);
const sortableJS = str2("# (sort)", ["- [ ]"], (s) => new model.SortableJS(s));
const nouislider = str2(
    "# (slide)",
    ["- [ ]", "----", "---"],
    (s) => new model.Nouislider(s)
);
const iPaddress = str2(
    "# (ip)",
    ["- [ ]", "----", "---"],
    (s) => new model.IPaddress(s)
);
const email = str2(
    "# (mail)",
    ["- [ ]", "----", "---"],
    (s) => new model.Email(s)
);
const cKEditor = str2(
    "# (ck)",
    ["- [ ]", "----", "---"],
    (s) => new model.CKEditor(s)
);
const emotionsRatings = str2(
    "# (erating)",
    ["- [ ]"],
    (s) => new model.EmotionsRatings(s)
);
const uml = str2("# (uml)", ["- [ ]", "----", "---"], (s) => new model.UML(s));

const question = str2(
    "- [ ]",
    ["- [ ]", "----", "---"],
    (s: string, lasttokenval: string) => {
        if (lasttokenval === "----" || lasttokenval === "---") {
            return new model.Question(s, true);
        } else {
            return new model.Question(s, false);
        }
    }
);
const sepratorquestion = str2(
    "----",
    [
        "# (t)",
        "# (r)",
        "# (d)",
        "# (c)",
        "# (i)",
        "# (b)",
        "# (si)",
        "# (mt)",
        "# (rating)",
        "# (statim)",
        "# (htm)",
        "# (file)",
        "# (dp)",
        "# (barrating)",
        "# (sort)",
        "# (slide)",
        "# (ip)",
        "# (mail)",
        "# (ck)",
        "# (erating)",
        "# (uml)",
    ],
    () => new model.QuestionSeparator()
);
const sepratorpage = str2(
    "---",
    [
        "# (t)",
        "# (r)",
        "# (d)",
        "# (c)",
        "# (i)",
        "# (b)",
        "# (si)",
        "# (mt)",
        "# (rating)",
        "# (statim)",
        "# (htm)",
        "# (file)",
        "# (dp)",
        "# (barrating)",
        "# (sort)",
        "# (slide)",
        "# (ip)",
        "# (mail)",
        "# (ck)",
        "# (erating)",
        "# (uml)",
    ],
    () => new model.PageSeparator()
);

// sep = sepratorquestion | sepratorpage
function sep(ctx: parser.Context): parser.Result<model.Sentence> {
    return parser.any<model.Sentence>([sepratorquestion, sepratorpage])(ctx);
}

function title(ctx: parser.Context): parser.Result<model.Sentence> {
    return parser.any<model.Sentence>([
        text,
        radio,
        dropdown,
        checkboxes,
        imagePicker,
        booleanEntry,
        signaturePad,
        multipletext,
        rating,
        staticImage,
        html,
        file,
        datepicker,
        barrating,
        sortableJS,
        nouislider,
        iPaddress,
        email,
        cKEditor,
        emotionsRatings,
        uml,
    ])(ctx);
}

// const parseCowSentence1 = sequence([cow, space, says, space, moo]);
const quizzdslq = parser.map(
    parser.sequence<any>([title, parser.many(question), sep]),
    // we combine the first argument and the trailing arguments into a single array
    ([arg1, rest, arg2]): model.Sentence[] => [arg1, ...rest, arg2]
);

export const quizzdsl = parser.many(quizzdslq);
