import { autoBinder } from "../decorators/autobind.js";
import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import { Component } from "./base-component.js";

   //============= projectItem class =============
export class ProjectItem extends Component<HTMLUListElement,HTMLLIElement> implements Draggable{
    private project:Project;

    get persons(){
        return this.project.peopleNum > 1 ? 'Persons' : 'Person';
    }

    constructor(hostId:string,project:Project){
        super(hostId,"single-project",false,project.id) //NOTE wrong parameter order generate import node problem 
        this.project = project

        this.configure()
        this.renderContent()
    
    }
    @autoBinder
    dragStartHandler(event: DragEvent): void {
       event.dataTransfer!.setData('text/plain',this.project.id)
       event.dataTransfer!.effectAllowed = 'move'
        
    }

    @autoBinder
    dragEndHandler(_: DragEvent): void {
        console.log("drag end");
        
    }

    configure(){
        this.element.addEventListener("dragstart",this.dragStartHandler)
        this.element.addEventListener("dragend",this.dragEndHandler)
    }
    
    renderContent(){
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = ` ${this.project.peopleNum} ${this.persons} assigned `
        this.element.querySelector('P')!.textContent = this.project.description
    }

}

