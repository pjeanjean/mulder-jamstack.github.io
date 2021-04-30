---
published: true
title: Learning through example
subTitle: a more complex component
slug: componentpublications
backgroundImage: 'url(assets/img/77982.jpg)'
---

<div style=" border:1px dotted black;" id="toc"></div>

To continue to understand this notion of a software component, let's imagine that you want to create a page that has dynamic behaviour. For example, this page consumes data from a service available on the Web, an API that allows you to obtain the publications of an author and on the fly creates a wordcloud from the words contained in the title and summary of these publications and provides a layout of this list of publications. 

## Step 1: create this new component

You can always use angular cli for this. 

## Step 2: access angular's http service

Use angular's dependency injection mechanism to access a service to make http requests to third party services. Angular provides in its standard library a [http service](https://angular.io/guide/http) that can be used.


```ts
constructor(private http: HttpClient) {}
```

## Step 3: Reuse existing component for managing a wordcloud

Since we want to generate and display wordclouds, let's search the internet to see if there is an angular component that already does this job. A quick search on the web brings us to [angular-d3-cloud](https://www.npmjs.com/package/angular-d3-cloud). Good news, such a component exists, no need to develop it, just reuse it. 

### Step 3.1 Install this third-party component

```bash
npm i angular-d3-cloud --save
```

in the module file of this new component, for example *mulder.module.ts*, import the *AngularD3CloudModule*. 

### Step 3.2 Use this third party component

After reading the [documentation of this component](https://github.com/maitrungduc1410/d3-cloud-angular), use it in the html template of the *publication* component. 

```html
                <div id="wordcloud" class="container">
                    <angular-d3-cloud
                    [data]="data"
                    [width]="large"
                    [height]="height"
                    [padding]="3"
                    [font]="FONT"
                    [rotate]="0"
                    [autoFill]="true"
                    [fillMapper]="color">
                </angular-d3-cloud>
```

## Step 4. Query the API

Query the API of the publication service after having read [its documentation](https://api.archives-ouvertes.fr/docs/search) and treat the data within the component. When initializing the component, let us do the query on the *api.archives-ouvertes.fr* service, then we store the data in a map indexed by year of publication (*docsPerYear*). We take advantage of the query result to retrieve all the terms used in the publications's abstract. 

```ts
const idhal = "olivierbarais";
this.onResize({});

this.http
.get<PublicationResponse>(
    "https://api.archives-ouvertes.fr/search/?omitHeader=true&wt=json&q=authIdHal_s%3A%28" +
        idhal +
        "%29&sort=producedDate_s%20desc&rows=2000&fl=authFullName_s,title_s,producedDateY_i,label_s,citationFull_s,keyword_s,producedDateY_i,linkExtUrl_s,fileMain_s,description_s,halId_id,language_s,publicationDateY_i,publicationDateY_s,uri_s"
)
.subscribe((r) => {
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
```

## Step 5. Finishing the component html template for displaying the publication list

Finally, we prepare the final html template of the componen to display both the wordcloud and the list of publications.

```html
<mulder-layout>
    <mulder-main-header backgroundImage='url("assets/img/Publications-Header.jpg")' heading="Publications"
        [siteHeading]="true">
    </mulder-main-header>
    ...
    <div class="container py-5 overlay">
        <div id="page-content">
            <div id="wordcloud" class="container">
                <angular-d3-cloud
                [data]="data"
                [width]="large"
                [height]="height"
                [padding]="3"
                [font]="FONT"
                [rotate]="0"
                [autoFill]="true"
                [fillMapper]="color">
                </angular-d3-cloud>
            </div>
            <div *ngFor="let year of years">
                <h2 class="text-light bg-info py-2 px-2">{{year}}</h2>
                <div *ngFor="let doc of docsPerYear.get(year)" class="publication preview-item">
                    <h4>{{doc.title_s}}</h4>
                    <h5>{{doc.label_s | author:doc.title_s}}</h5>
                    <h6>{{doc.label_s | descbib:doc.title_s}}</h6>
                    <a class="pubButton btn btn-outline-info rounded" [href]="doc.uri_s"
                        target="_blank">Details</a>
                        <a *ngIf="doc.fileMain_s" class="pubButton btn btn-outline-info rounded" [href]="doc.fileMain_s"
                        target="_blank">pdf</a>
                </div>
            </div>
        </div>
    </div>
</mulder-layout>
```

A bit of CSS ultimately makes it look better. 

```css
#research-axes {
    .icon-label { margin-top: 1.5em;
        h4 { font-size: 1.2em; }
    }

    .icon-item { margin: 20px 0; }
}
.preview-item {
    margin: 20px 0;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,0.125);
    border-radius: .25rem;
    padding: 1em;
}

.preview-section {
    margin: 30px 0;

    .side-icon {
        top: 10%;
    }
}
```

Let us manage the routing to load the *PublicationsComponent* component of the Mulder module when someone arrive on the */publications* route

The result is visible [here](/publications)
The complete source code of this component is visible [here](https://github.com/mulder-jamstack/mulder-jamstack.github.io/tree/src/src/app/mulder/containers/publications)