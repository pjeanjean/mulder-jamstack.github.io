import { HttpClient } from "@angular/common/http";
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { SuerveyJSPrinter } from "@app/surveyplugin/quizzdsl/prettyprinter";

@Component({
    selector: "mulder-surveydemo",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./surveydemo.component.html",
    styleUrls: ["surveydemo.component.scss"],
})
export class SurveyDemoComponent implements OnInit, OnDestroy {
    constructor(private http: HttpClient) {
        const p = new SuerveyJSPrinter(
            "Examen SIR 2020",
            "Demo consigne",
            3600,
            "random",
            "random",
            "<p><h4>Merci pour avoir compléter cet examen de SIR</h4></p>"
        );
        const s1 = p.print(`# (c) Dans une architecture REST, Si l’on utilise JAXRS, modifiez une données côté serveur sur l’appel d’un GET crée
- [ ] une erreur de compilation
- [ ] un warning
- [ ] rien du tout
- [ ] cela dépend des types de modifications effectuées en base

----

# (c)
\`\`\`java
// MyData est une simple classe Java de données (POJO avec getter et setter)
@GET
@Path("/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_XML)
public List<TODOListItem> getTodoByD(Mydata d) {
    ...
}
\`\`\`

Le code ci dessus est:
- [ ] Valide
- [ ] Invalide car le @GET devrait être un @POST ou un @PUT
- [ ] Invalide car le service devrait renvoyait du json MediaType.APPLICATION_JSON
- [ ] invalide car le nom de la méthode ne devrait pas commencer par get

----

# (ck)
Test ck
- [ ] Valide
- [ ] Valide
- [ ] Valide


----

# (r)
Vous pouvez créer une référence locale HTML d'une balise HTML en utilisant une variable qui commence par le caractère...

- [ ] @
- [ ] #
- [ ] *
- [ ] &

---

# (r)

Sélectionnez le nom de classe de contrôle de formulaire correct, défini sur true via [(ngModel)] chaque fois que la valeur est modifiée.

- [ ] .ng-invalid
- [ ] .ng-pending
- [ ] .ng-pristine
- [ ] .ng-dirty

----

# (r)
Si vous fournissez un service personnalisé dans la section "providers" de @Component Decorator, combien d'instances de service doivent être créées?

- [ ] 1
- [ ] 2
- [ ] 3
- [ ] 4

---

`);

        const s = JSON.parse(eval(s1));
        console.log(s);
        // Random pages
        const init = s.pages.shift();
        this.shuffleArray(s.pages);
        s.pages = [init, ...s.pages];

        this.json = s;
    }
    json: any;

    // canbesaved = true;

    shuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    ngOnInit(): void {}

    sendData(result: any) {
        const formData = new FormData();
        const dataStr = new Blob([JSON.stringify(result)], {
            type: "application/json",
        });
        // var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));

        formData.append("upload[]", dataStr, "result.json");

        this.http.post("/upload", formData).subscribe(
            (res: any) => {},
            (err: any) => {}
        );
    }

    sendFinalData(result: any) {
        const formData = new FormData();
        const dataStr = new Blob([JSON.stringify(result)], {
            type: "application/json",
        });
        // var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));

        formData.append("upload[]", dataStr, "result.json");

        this.http.post("/upload", formData).subscribe(
            (res: any) => {
                console.log(result);
            },
            (err: any) => {
                console.log("upload failed");
                console.log(result);
            }
        );
    }

    ngOnDestroy() {}
}
