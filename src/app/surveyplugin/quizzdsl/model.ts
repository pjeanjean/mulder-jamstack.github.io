export class Text {
    type = "Text" as const;
    constructor(public desc: string) {}
}
export class Radio {
    type = "Radio" as const;
    constructor(public desc: string) {}
}
export class Dropdown {
    type = "Dropdown" as const;
    constructor(public desc: string) {}
}
export class Checkboxes {
    type = "Checkboxes" as const;
    constructor(public desc: string) {}
}
export class ImagePicker {
    type = "ImagePicker" as const;
    constructor(public desc: string) {}
}
export class BooleanEntry {
    type = "BooleanEntry" as const;
    constructor(public desc: string) {}
}
export class SignaturePad {
    type = "SignaturePad" as const;
    constructor(public desc: string) {}
}
export class Multipletext {
    type = "Multipletext" as const;
    constructor(public desc: string) {}
}
export class Rating {
    type = "Rating" as const;
    constructor(public desc: string) {}
}
export class StaticImage {
    type = "StaticImage" as const;
    constructor(public desc: string) {}
}
export class Html {
    type = "Html" as const;
    constructor(public desc: string) {}
}
export class File {
    type = "File" as const;
    constructor(public desc: string) {}
}
export class Datepicker {
    type = "Datepicker" as const;
    constructor(public desc: string) {}
}
export class Barrating {
    type = "Barrating" as const;
    constructor(public desc: string) {}
}
export class SortableJS {
    type = "SortableJS" as const;
    constructor(public desc: string) {}
}
export class Nouislider {
    type = "Nouislider" as const;
    constructor(public desc: string) {}
}
export class IPaddress {
    type = "IPaddress" as const;
    constructor(public desc: string) {}
}
export class Email {
    type = "Email" as const;
    constructor(public desc: string) {}
}
export class CKEditor {
    type = "CKEditor" as const;
    constructor(public desc: string) {}
}
export class EmotionsRatings {
    type = "EmotionsRatings" as const;
    constructor(public desc: string) {}
}
export class UML {
    type = "UML" as const;
    constructor(public desc: string) {}
}

export class Question {
    type = "Question" as const;
    constructor(public desc: string, public last: boolean) {}
}
export class QuestionSeparator {
    type = "QuestionSeparator" as const;
    constructor() {}
}
export class PageSeparator {
    type = "PageSeparator" as const;
    constructor() {}
}

export type Sentence =
    | Text
    | Radio
    | Dropdown
    | Checkboxes
    | ImagePicker
    | BooleanEntry
    | SignaturePad
    | Multipletext
    | Rating
    | StaticImage
    | Html
    | File
    | Datepicker
    | Barrating
    | SortableJS
    | Nouislider
    | IPaddress
    | Email
    | CKEditor
    | EmotionsRatings
    | UML
    | Question
    | QuestionSeparator
    | PageSeparator;

// Pattern matching on model

export type SentenceType = Sentence["type"];
export type SentenceMap<U> = {
    [K in SentenceType]: U extends { type: K } ? U : never;
};
export type SentenceTypeMap = SentenceMap<Sentence>;
export type Pattern<T> = {
    [K in keyof SentenceTypeMap]: (shape: SentenceTypeMap[K]) => T;
};

export function matcher<T>(pattern: Pattern<T>): (sentence: Sentence) => T {
    return (sentence) => pattern[sentence.type](sentence as any);
}
