namespace App{
    //======================== auto binder ======================
export function autoBinder(
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
}