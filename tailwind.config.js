module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            dropShadow: {
                rb: '1.5px 1.5px 0 rgba(0, 0, 0, 0.5)'
            },
            animation: {
                popUp: 'popUp 0.5s ease-in-out',
                popUpFast: 'popUp 0.25s ease-in-out',
                popUpOut: 'popUpOut 2s ease-in-out forwards'
            },
            keyframes: {
                popUp: {
                    '0%': {
                        scale: '0',
                        opacity: '0'
                    },
                    '100%': {
                        scale: '1',
                        opacity: '1'
                    }
                },
                popUpOut: {
                    '0%': {
                        scale: '0',
                        opacity: '0'
                    },
                    '25%, 75%': {
                        scale: '1',
                        opacity: '1'
                    },
                    '100%': {
                        scale: '2',
                        opacity: '0'
                    }
                }
            }
        }
    },
    plugins: []
};
