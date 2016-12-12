import React from 'react';

export default React.createClass({
    getInitialState: function() {
        return {
            buttons: ['um', 'like', 'whatever']
        }
    },
    render: function() {
        const buttonList = this.state.buttons.map((button, iterator) => {
            return <button key={ iterator } className="button">{ button }</button>;
        });
        return (
            <div className="button-container">
                { buttonList }
            </div>
        );
    }
});
