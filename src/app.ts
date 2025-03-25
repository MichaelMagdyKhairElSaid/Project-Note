//auto binder
function autoBinder(
    _target: any, //_ underscore used for informing tsc that this prams will never be used
    _methodName: string,
    descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adDEscriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adDEscriptor

}

interface Verifiable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validateInput: Verifiable) {
    let isValid = true
    const { value, max, maxLength, min, minLength, required } = validateInput
    if (required) {
        isValid = isValid && value.toString().trim().length !== 0
    }
    if (minLength != null && typeof value === "string") {
        isValid = isValid && value.length >= minLength
    }
    if (maxLength != null && typeof value === "string") {
        isValid = isValid && value.length <= maxLength
    }
    console.log("value type :" + typeof value);

    if (min != null && typeof value === "number") {
        isValid = isValid && +value >= min
    }
    if (max != null && typeof value === "number") {
        isValid = isValid && +value <= max
    }
    return isValid
}

class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLDivElement

        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild as HTMLFormElement
        this.element.id = "user-input" // adding id using ts

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement

        this.configure()
        this.attach()
    }

    //===== Anther way to solve "this" problem is to use anonymous function  ============

    // private configure(){
    //     this.element.addEventListener("submit",(e:Event)=>{
    //         e.preventDefault()
    //         console.log(this.titleInputElement.value);
    //     }) // bind this is used to make this refer to class not 
    // }

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
            this.clearInput(); 
        }
    }

    private configure() {
        this.element.addEventListener("submit", this.submitHandler) // bind this is used to make this refer to class not 
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element)
    }


}

const prjInput = new ProjectInput();