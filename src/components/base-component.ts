
    //============ Component base class ===========

export abstract class Component<T extends HTMLElement , U extends HTMLElement>{
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
