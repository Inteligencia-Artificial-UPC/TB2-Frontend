const input100 = document.getElementsByClassName("input100");
for (let i = 0; i < input100.length; i++){
    let inp =input100.item(i);
    inp.onblur = () => {
        if (inp.value.trim() != "") {
            inp.classList.add("has-val");
        }
        else {
            inp.classList.remove("has-val")
        }
    }
}