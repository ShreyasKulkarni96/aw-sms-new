const Button = ({ children, disabled, to, style, onClick, type }) => {

    const styles = {
        small: 'mr-1 px-5 py-2 inline-block text-sm font-semibold tracking-wide bg-orangePrimary rounded-3xl duration-300 hover:bg-orangeSecondary shadow-md text-white',
        primary: 'w-full px-5 py-2 inline-block text-sm font-semibold tracking-wide bg-orangePrimary rounded-3xl duration-300 hover:bg-orangeSecondary shadow-md text-white',
        cancel: 'ml-1 px-5 py-2 inline-block text-sm font-semibold tracking-wide bg-black rounded-3xl duration-300 hover:bg-grayHover shadow-md text-white',
        delete: 'ml-1 px-5 py-2 inline-block text-sm font-semibold tracking-wide bg-red-600 rounded-3xl duration-300 hover:bg-red-400-hover shadow-md text-white'
    }

    return (
        <button className={styles[style]} type={type} onClick={onClick}>
            {children}
        </button>
    )
};

export default Button;