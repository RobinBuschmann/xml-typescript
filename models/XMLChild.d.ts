import 'es6-shim';
export declare class XMLChild {
    private options;
    private name;
    static process(target: any, key: string, options?: any, descriptor?: TypedPropertyDescriptor<any>): void;
    setSchema(target: any, parentEntity: any, isAsync?: boolean): any;
    private constructor(options);
    private resolveImplicitStructure(structure, target, schema);
    private getImplicitNodeTree(treeString);
    private getAttributes(attributeString);
}
