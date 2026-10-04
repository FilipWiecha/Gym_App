import type { ReactNode } from "react";

export function PageLayout({ children }: { children: ReactNode }) {
    return (
        <div className="login-layout">
            <main className="login-main">
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
