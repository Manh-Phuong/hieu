import React from 'react';

export default function DefaultLayout({ title, children }) {
    return (
        <div>
            <div>{children}</div>
        </div>
    );
}
