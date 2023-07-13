$(document).ready(function () {

  $('.mask-money').mask('000,000,000,000,000.00', { reverse: true, placeholder: "0.00" });
  $('.mask-phone').mask('(000) 000-0000', { placeholder: "(___) ___-____" });
  $('.mask-mobile').mask('+63 999-999-9999', { placeholder: "+63 ___-___-____" });
  $('.mask-percent').mask('000%', { reverse: true, placeholder: "0%" });

});
