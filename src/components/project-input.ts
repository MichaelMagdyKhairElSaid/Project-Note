///<reference path="base-component.ts"/>
namespace App{
    // ============ project input class ============
export class ProjectInput extends Component<HTMLElement,HTMLFormElement> {
    

    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        super("app","project-input",true ,"user-input")

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement

        this.configure()
    }

    configure() {
        this.element.addEventListener("submit", this.submitHandler) // bind this is used to make this refer to class not 
        }
    renderContent(): void { }

    private gatherData(): [string, string, number] | void {
        let titleData = this.titleInputElement.value
        let descData = this.descriptionInputElement.value
        let peopleData = this.peopleInputElement.value

        const titleVerifiable: Verifiable = {
            value: titleData,
            required: true,
            minLength: 5,
        }
        const descVerifiable: Verifiable = {
            value: descData,
            required: true,
            minLength: 5,
        }
        const peopleVerifiable: Verifiable = {
            value: +peopleData,
            required: true,
            min: 1,
            max: 5
        }

        if (
            validate(titleVerifiable) &&
            validate(peopleVerifiable) &&
            validate(descVerifiable)
        ) {
            return [titleData, descData, +peopleData] //add + plus to convert it to number or use parseFloat()
        } else {
            alert("Invalid input , pleas try again!")
            return;
        }

    }

    private clearInput(){
        this.titleInputElement.value = ""
        this.descriptionInputElement.value =""
        this.peopleInputElement.value = ""
    }

    @autoBinder
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherData()
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput
            console.log(title, desc, people);
            projectState.addProject(title, desc, people)
            this.clearInput(); 
        }
    }
}

}