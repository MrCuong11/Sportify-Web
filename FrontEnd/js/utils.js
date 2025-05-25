// Export elements of this module
export { showPassword };

// EASTER EGG FUNCTION: When eye had been clicked, reveal password
function showPassword(type) {
    
    if (type == 0) {
        document.getElementById("password").type = "text";
        document.getElementById("seePassword").addEventListener("mouseup", () => {
            document.getElementById("password").type = "password";
        });
    } else {
        document.getElementById("confirmPassword").type = "text";
        document.getElementById("seeConfirmedPassword").addEventListener("mouseup", () => {
            document.getElementById("confirmPassword").type = "password";
        });
    }
}
