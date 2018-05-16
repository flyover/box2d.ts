export declare class b2GrowableStack {
    m_stack: any[];
    m_count: number;
    constructor(N: number);
    Reset(): b2GrowableStack;
    Push(element: any): void;
    Pop(): any;
    GetCount(): number;
}
