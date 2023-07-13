using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Diagnostics.Metrics;
using Test.Interface;
using Test.Models;

namespace Test.Controllers
{
    [ApiController]
    [Route("[controller]")]
    
    public class CountryController : ControllerBase
    {


        private readonly ICountry _ICountry;

        
        public CountryController(ICountry iCountry)
        {
            _ICountry = iCountry;
        }

        // GET
        [HttpGet]
        [Route("/GetCountries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            var res = await _ICountry.GetCountriesAsync();
            return Ok(res);
        }

        // GET by Id
        [HttpGet]
        [Route("/GetCountryById/{Id}")]
        public async Task<ActionResult<Country>> GetCountryById(int Id)
        {
            var res = await _ICountry.GetCountryById(Id);
            return Ok(res);
        }

        // POST
        [HttpPost]
        [Route("/PostCountry")]
        public async Task<ActionResult> PostCountry(Country country)
        {
            var res = await _ICountry.PostCountry(country);
            if (res)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        // POST
        [HttpPut]
        [Route("/PutCountry")]
        public async Task<ActionResult> PutCountry(Country country)
        {
            var res = await _ICountry.PutCountry(country);
            if (res)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE by Id
        [HttpDelete]
        [Route("/DeleteCountryById/{Id}")]
        public async Task<ActionResult> DeleteCountryById(int Id)
        {
            var res = await _ICountry.DeleteCountryById(Id);
            if (res)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}