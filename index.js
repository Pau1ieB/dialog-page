const currentCard={
    id:"",
    type:{
        "3":"img-amex",
        "4":"img-visa",
        "5":"img-mcard",
        "6":"img-discover"
    }
}

const validate=e=>{
    if(e.target.value.length==0)
        setFieldValidity(e.target,"zero",["bg-invalid","bg-valid"],[],`error-${e.target.name}`,true);
    else if(e.target.validity.valid && (e.target.dataset.valid==="false" || e.target.dataset.valid==="zero"))
        setFieldValidity(e.target,"true",["bg-invalid"],["bg-valid"],`error-${e.target.name}`,true);
    else if(!e.target.validity.valid && (e.target.dataset.valid==="true" || e.target.dataset.valid==="zero"))
        setFieldValidity(e.target,"false",["bg-valid"],["bg-invalid"],`error-${e.target.name}`,false);
}

const validateCard=e=>{
    validate(e);
    const cardType = document.querySelector('#card-type');
    const cardImage = document.querySelector('#card-image');
    const ident = e.target.value[0];
    if(currentCard.id.length>0 && ((!e.target.validity.valid || e.target.value.length==0) || currentCard.id!==ident)){
        cardImage.classList.remove(currentCard.type[currentCard.id]);
        currentCard.id='';
    }
    if(e.target.validity.valid && e.target.value.length>0){
        if((ident==="3" || ident==="4"  || ident==="5"  || ident==="6")){
            if(currentCard.id.length==0){
                currentCard.id=ident;
                if(cardType.dataset.show==="false"){
                    cardType.dataset.show="true";
                    cardType.classList.remove("hidden");
                    cardType.classList.add("valid-card");
                }
                cardImage.classList.add(currentCard.type[currentCard.id]);
            }
            if(currentCard.id==='3' && e.target.value.length==16)e.target.value=e.target.value.substring(0,e.target.value.length-1);
            document.querySelector('#card-length').textContent = `${e.target.value.length}/${(currentCard.id==='3')?15:16}`;
            return;
        }
    }
    if(cardType.dataset.show==="true"){
        cardType.dataset.show="false";
        cardType.classList.add("hidden");
        cardType.classList.remove("valid-card");
    }
}

const setFieldValidity=(elem,data,remove,add,id,hidden)=>{
    elem.dataset.valid=data;
    remove.forEach(e => elem.classList.remove(e));
    add.forEach(e => elem.classList.add(e));
    (hidden)?document.querySelector(`#${id}`).classList.add('hidden'):document.querySelector(`#${id}`).classList.remove('hidden');
}
const LUHN=card=>{
    const arr = card.split("").reverse().map((x) => parseInt(x));
    const lastDigit = arr.shift();
    const sum = arr.reduce((acc, val, i) => acc + ((i % 2 !== 0)? val : (val > 4 ? val*2 -9 : val*2)), 0);
    return (10 - (sum % 10)) % 10 === lastDigit;
}

const errorsOnForm= message=>{
    const elem = document.querySelector("#error-form");
    elem.textContent=message;
    elem.classList.remove('hidden');
    elem.blur();
    elem.focus();
    setInterval(()=>{
        elem.textContent="";
        elem.classList.add("hidden");
    },3000);
}

document.querySelector('input[type="submit"]').addEventListener('click',e=>{
    e.preventDefault();
    const name = document.querySelector('input[name="name"]');
    const email = document.querySelector('input[name="email"]');
    const card = document.querySelector('input[name="card"]');
    if(name.value.length==0 || email.value.length==0 || card.value.length==0){
        errorsOnForm("You need to enter values for each field");
        return;
    }
    if(!name.validity.valid){
        errorsOnForm("You need to correct errors on the name field");
        return;
    }
    if(!email.validity.valid){
        errorsOnForm("You need to correct errors on the email field");
        return;
    }
    if(!card.validity.valid){
        errorsOnForm("You need to correct errors on the card number field");
        return;
    }
    if(currentCard.id.length==0 || (currentCard.id==='3' && card.value.length!=15)  || (currentCard.id!=='3' && card.value.length!=16) || !LUHN(card.value)){
        errorsOnForm("You need to add a valid card");
        return;
    }
    const args=`name=${name.value};email=${email.value};card=${card.value}`;
    window.location.href = `mailto:test@dn-uk.com?body='${args}'`;

    if(confirm("The email has been sent. Do you want to clear all the fields?")){
        [name,email,card].forEach(elem=>{
            elem.value='';
            elem.dataset['valid']='zero';
            elem.classList.remove("bg-valid");
        })
        currentCard.id=-1;
        const cardType = document.querySelector('#card-type');
        cardType.dataset.show="false";
        cardType.classList.add("hidden");
        cardType.classList.remove("valid-card");
    }
})

document.querySelector('input[name="name"]').addEventListener('input',validate)

document.querySelector('input[name="email"]').addEventListener('input',validate)

document.querySelector('input[name="card"]').addEventListener('input',validateCard)
