module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            dropShadow: {
                rb: '1.5px 1.5px 0 rgba(0, 0, 0, 0.5)'
            },
            animation: {
                announce: 'popUpOut 2s ease-in-out forwards'
            },
            keyframes: {
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
