$(function(){
    console.log(localStorage)
    // localStorage.clear()
    
    const savedList = JSON.parse(localStorage.getItem('savingsList')) || [];
    if(savedList.length){
        savedList.forEach(data => {
            // data.saved = parseFloat(localStorage.getItem(data.id)) || 0;
            // console.log(data)
            console.log(data)
            showSavings(data)
        });
    }    else{
        drawPlus()
    }
    
    // console.log(savedList.length)
    // localStorage.clear()
    // console.log(localStorage)

    $("#convert").click(function() {
        let amount = $("#amount").val();
        let from = $("#fromCurrency").val();
        let to = $("#toCurrency").val();
        
        if (amount === "" || amount <= 0) {
            alertify.error("Введіть коректну суму");
            return;
        }

        let url = `https://api.exchangerate-api.com/v4/latest/${from}`;
        
        $.getJSON(url, function(data) {
            let rate = data.rates[to];
            let converted = (amount * rate).toFixed(2);
            $("#result").text(`${amount} ${from} = ${converted} ${to}`);
        });
    })
    $('.menu').click(function(e){
        e.preventDefault();
        // var oldTarget = $('#mainPage').offset().top
        // var newTarget = $(this).offset().top
        var target = $(this).attr('href'); // Получаем id секции
        // var newTarget = target.offset().top
        // var diff = oldTarget - newTarget
        $('.menu').css('background-color', 'cornflowerblue'); 
        $(this).css('background-color', 'darkcyan');

        // Временно отключаем фиксацию ScrollMagic
        // controller.enabled(false);

        // Плавная прокрутка
        // if($(`#${target}`))
        // console.log($(target).X())
        $('html, body').animate({

            // scrollTop: $(window).scrollTop()+diff

            scrollTop: $(target).offset().top
        }, 500, function() {
            // После завершения анимации включаем ScrollMagic обратно
            // controller.enabled(true);
            console.log(target)
        });
    });

    // var controller = new ScrollMagic.Controller({
    //     globalSceneOptions: {
    //         triggerHook: 'onLeave',
    //         duration: "100%"
    //     }
    // });

    // var slides = document.querySelectorAll(".panel");

    // for (var i = 0; i < slides.length; i++) {
    //     new ScrollMagic.Scene({
    //             triggerElement: slides[i]
    //         })
    //         .addIndicators()
    //         .setPin(slides[i], { pushFollowers: false })
    //         .addTo(controller);
    // }

    $(document).on('click','#newSaving',(function(){
        $(this).parent().html(`<div class='newSavingSettings'>
            <input type="text" name="newSavingTitle" id="newSavingTitle" placeholder="На що копимо?">
                <div class="priceSettings">
                    <input type="text" name="newSavingPrice" id="newSavingPrice" placeholder="Скільки коштує?">
                    <select name="newSavingcurrency" id="newSavingCurrency">
                        <option value="UAH">UAH</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>
                <div class="userChoise">
                    <div class="newSavingButton" id="newSavingOK">OK</div>
                    <div class="newSavingButton" id="newSavingCancel">Відміна</div>
                </div>    
            </div>
                `)
    }))

    $(document).on('click', '#newSavingCancel', function(){
        $(this).closest('.userSaving').html(`<div class="newSaving" id="newSaving">+</div>`)
    })
    
    $(document).on('click', '#newSavingOK', function () {
        var savingName = $('#newSavingTitle').val();
        var savingPrice = parseFloat($('#newSavingPrice').val());
        var savingCurrency = $('#newSavingCurrency').val();

        if (!savingName || isNaN(savingPrice) || savingPrice <= 0) {
            alertify.error("Введені данні некоректні")
            return;
        }
    
        var savingData = {
            name: savingName,
            target: savingPrice,
            saved: 0,
            currency: savingCurrency
        }

        // console.log(savings)
    
        let savings = JSON.parse(localStorage.getItem('savingsList')) || [];
        // console.log(savings)
        savings.push(savingData);
        // console.log(savings)
        localStorage.setItem('savingsList', JSON.stringify(savings));
        // console.log(JSON.parse(localStorage.getItem('savingsList')))
        // savings.forEach(element => {
        //     console.log(element.name)
        // });
        const savedList = JSON.parse(localStorage.getItem('savingsList')) || [];
        savedList.forEach(data => {
            data.saved = parseFloat(localStorage.getItem(data.id)) || 0;
            // console.log(data)
            // renderBar(data);
            console.log(data)
            showSavings(data)
        });
        // renderBar(savingData);
        // $('#newSavingTitle').val('');
        // $('#newSavingPrice').val('');
        // $('#newSavingCurrency').val('');
    });

    $(document).on('click', '#deleteButton', function(){
        localStorage.clear()
        drawPlus()
    })  

    $(document).on('click', '#addMoneyButton', function(){
        var add = parseFloat($('.addMoneyInput').val())
        if(add>0){
            var savedList = JSON.parse(localStorage.getItem('savingsList'))
            savedList.forEach(data => {
                savingName = data.name
                savingPrice = data.target
                saved = data.saved
                savingCurrency = data.currency
                console.log(data)
            });
            saved+=add
            if(saved >= savingPrice){
                localStorage.clear()
                alertify.success("Вітаємо з успішним накопиченням!")
                drawPlus()
                return
            }
            console.log(saved)
            localStorage.clear()
            var savingData = {
                name: savingName,
                target: savingPrice,
                saved: saved,
                currency: savingCurrency
            }
            savings.push(savingData);
            
            // console.log(savings)
            localStorage.setItem('savingsList', JSON.stringify(savings));
            console.log(localStorage)
            savedList = JSON.parse(localStorage.getItem('savingsList')) || [];
            savedList.forEach(data => {
                // data.saved = parseFloat(localStorage.getItem(data.id)) || 0;
                // console.log(data)
                // renderBar(data);
                console.log(data)
                showSavings(data)
            });
        }else{
            alertify.error("Введені данні некоректні")
        }
    })  
});


function showSavings(data){
    $('.savings').html('')
        $('.savings').prepend(`
            <div class="userSaving">
                <div class="savingInfo">
                    <h2 class="savingTitle">${data.name}: ${data.target} ${data.currency}</h2>
                    <!-- <div class="userSavingSettings"> -->
                        <input type="text" class="addMoneyInput" placeholder="Додати">
                        <div class="buttons">
                            <div class="addMoneyButton" id="addMoneyButton">Додати</div>
                            <div class="deleteButton" id="deleteButton">Видалити</div>
                        </div>
                    <!-- </div> -->
                </div>
                <div class="savingBar">
                    <input type="text" class="bar" id="bar1" value="${data.saved}">
                </div>
                
            </div>
        `)
  
        $('.bar').knob({
            'min':0,
            'max':data.target,
            'fgColor':'blue',
            'bgColor':'lightblue',
            'inputColor':'black',
            'height': 300,
            'width': 300,
            'readOnly': true,
        })


}

function drawPlus(){
    $('.savings').html('')
        $('.savings').prepend(`
            <div class="userSaving">
                <div class="newSaving" id="newSaving">+</div>
            </div>
        `)
}

savings=[]