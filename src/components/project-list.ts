///<reference path="base-component.ts"/>
namespace App{
    // ============ project List class ============
export class ProjectList extends Component<HTMLDivElement,HTMLElement> implements DragTarget{

    assignedProject:Project[]

    constructor(private type:"active"|"finished"){
        super("app","project-list",false,`${type}-projects`)
        this.assignedProject =[]
        this.configure()
        this.renderContent()
    }
    @autoBinder
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] ==='text/plain') {
            event.preventDefault() //make dropping allowed in browser
            const listEl = this.element.querySelector("ul")!
        listEl.classList.add("droppable") // add class to change color when dragged obj is over
        }
        
    }
    @autoBinder
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData("text/plain")
        projectState.moveProject(prjId,this.type === 'active' ? ProjectStatus.Active:ProjectStatus.Finished)
    }

    @autoBinder
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector("ul")!
        listEl.classList.remove("droppable")
    }

   private renderProjects(){
    
        this.element.addEventListener("dragover",this.dragOverHandler)
        this.element.addEventListener("dragleave",this.dragLeaveHandler)
        this.element.addEventListener("drop",this.dropHandler)

        const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement
        listEl.innerHTML=""      // to remove duplication of new added projects

        for(const projItem of this.assignedProject){
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

}