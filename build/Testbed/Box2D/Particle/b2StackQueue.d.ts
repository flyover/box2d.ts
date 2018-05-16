export declare class b2StackQueue<T> {
    m_buffer: T[];
    m_front: number;
    m_back: number;
    m_capacity: number;
    constructor(capacity: number);
    Push(item: T): void;
    Pop(): void;
    Empty(): boolean;
    Front(): T;
}
