// create project 
enum ProjectStatus {"Active" , "Finished"}
class Project{
    constructor(public id:string ,
         public title:string ,
         public description:string ,
         public peopleNum:number,
         public status:ProjectStatus
         ){

    }
}
//============ project State Management ===============
type listener<T> = (items:T[])=>void

class State<T>{
    protected listeners:listener<T>[]=[]

    addListener(listenerFn:listener<T>){
        this.listeners.push(listenerFn)
    }
}

class ProjectState extends State<Project>{
    
    private projects:Project[]=[]
    private static instance:ProjectState

    private constructor(){ //prevent using constructor by using private
        super()
    }

    static getInstance(){
        if (this.instance) {return this.instance}
        
        this.instance = new ProjectState()
        return this.instance
    }

    

    addProject(title:string , description:string , people:number){

        const newProject = new Project(
        Math.random().toString(),
        title,description,
        people,
        ProjectStatus.Active
        )

        this.projects.push(newProject)
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }

}

const projectState = ProjectState.getInstance() ;
//======================== auto binder ======================
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

//============ Component base class ===========

abstract class Component<T extends HTMLElement , U extends HTMLElement>{
    templateElement: HTMLTemplateElement;
    hostElement :T;
    element: U;

    constructor(
        hostElementId:string,
        templateElementId:string,
        insertAtStart:boolean,
        newElementId?:string
        ){
            this.templateElement = document.getElementById(templateElementId)! as HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId)! as T

        const importNode = document.importNode(
            this.templateElement.content, 
            true
        );
        this.element = importNode.firstElementChild as U
        if (newElementId) {
            this.element.id = newElementId// adding id using js
        }
        this.attach(insertAtStart)
        
        }
        private attach(insertAtBeginning:boolean){
            this.hostElement.insertAdjacentElement(
                insertAtBeginning?"afterbegin":"beforeend",
                this.element
                )
        }

        abstract configure():void
        abstract renderContent():void
}

//============= projectItem class =============
class ProjectItem extends Component<HTMLUListElement,HTMLLIElement>{
    private project:Project;

    constructor(hostId:string,project:Project){
        super(hostId,"single-project",false,project.id) //NOTE wrong parameter order generate import node problem 
        this.project = project

        this.configure()
        this.renderContent()
    
    }
    configure(){}
    
    renderContent(){
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.project.description
        this.element.querySelector('P')!.textContent = this.project.peopleNum.toString()
    }

}

// ============ project List class ============
class ProjectList extends Component<HTMLDivElement,HTMLElement>{

    assignedProject:Project[]

    constructor(private type:"active"|"finished"){
        super("app","project-list",false,`${type}-projects`)
        this.assignedProject =[]
        this.configure()
        this.renderContent()
    }

   private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement
        listEl.innerHTML=""      // to remove duplication of new added projects
        for(const projItem of this.assignedProject){
            //==========my way for adding styling to each project ==========
          /*   const listItem =document.createElement('li')
            const titleEle = document.createElement("p")
            const descEle = document.createElement("p")
            const peopleEle = document.createElement("p")
            const button = document.createElement("button")
            titleEle.textContent = `Title :${projItem.title}`
            descEle.textContent =`Description :${projItem.description}`
            peopleEle.textContent = `people :${projItem.peopleNum}`
            button.textContent =`Finished`

            titleEle.classList.add("ls-title")
            descEle.classList.add("ls-desc")
            peopleEle.classList.add("ls-people")
            button.addEventListener("click",()=>{
                if (this.type === "active") {
                    console.log("active");
                    
                    this.type = "finished"
                    this.configure()
                }else{
                    console.log("finished");
                    this.type = "active"
                    this.configure()
                }
            })

            listItem.appendChild(titleEle)
            listItem.appendChild(descEle)
            listItem.appendChild(peopleEle)
            listItem.appendChild(button)
            listEl?.appendChild(listItem) */ 
            new ProjectItem(this.element.querySelector("ul")!.id,projItem) // main element is section which have ul we want to put li in it 
        } 
    }
    configure(): void {
        projectState.addListener((projects:Project[])=>{
            const relevantProject = projects.filter(prj =>{ 
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active
                }else{
                    return prj.status ===ProjectStatus.Finished
                }
            })
            this.assignedProject=relevantProject;
            this.renderProjects()
        })
    }

     renderContent(){
        const  listId = `${this.type}-projects-list`
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = 
        this.type.toUpperCase()+" PROJECTS";
    }

    
}

// ============ project class ============
class ProjectInput extends Component<HTMLElement,HTMLFormElement> {
    

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

//=================== Main program ======================================
const prjInput = new ProjectInput();
const activeProject = new ProjectList("active")
const finishedProject = new ProjectList("finished")
// const finished2Project = new ProjectList("active")