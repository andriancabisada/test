using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Metrics;
using Test.Interface;
using Test.Models;

namespace Test.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class CityController : ControllerBase
    {
        private readonly ICity _ICity;

        public CityController(ICity icity)
        {
            _ICity = icity;
        }

        // GET
        [HttpGet]
        [Route("/GetCities")]
        public async Task<ActionResult<IEnumerable<City>>> GetCities()
        {
            var res = await _ICity.GetCitiesAsync();
            return Ok(res);
        }

        [HttpGet]
        [Route("/GetCityById/{id}")]
        public async Task<ActionResult<City>> GetCityById(int id)
        {
            var res = await _ICity.GetCityById(id);
            return Ok(res);

        }

        [HttpPut]
        [Route("/PutCity")]
        public async Task<ActionResult> UpdateCity(City city)
        {
            var res = await _ICity.Update(city);
            if (res)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("/PostCity")]
        public async Task<ActionResult> SaveCity(City city)
        {
            var res = await _ICity.Add(city);
            if (res)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }


        [HttpDelete]
        [Route("/DeleteCityById/{id}")]
        public async Task<ActionResult> DeleteCity(int id)
        {
            var res = await _ICity.Delete(id);
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