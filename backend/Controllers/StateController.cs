using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Metrics;
using Test.Interface;
using Test.Models;

namespace Test.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StateController : ControllerBase
    {
        private readonly IState _IState;

        public StateController(IState state)
        {
            _IState = state;
        }

        // GET
        [HttpGet]
        [Route("/GetStates")]
        public async Task<ActionResult<IEnumerable<State>>> GetStates()
        {
            var res = await _IState.GetStatesAsync();
            return Ok(res);
        }
  

        [HttpGet]
        [Route("/GetStateById/{id}")]
        public async Task<ActionResult<State>> GetStateById(int id) 
        { 
            var res = await _IState.GetStateById(id);
            return Ok(res);
        }

        [HttpPut]
        [Route("/PutState")]
        public async Task<ActionResult> UpdateState(State state)
        {
            var res = await _IState.PutState(state);
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
        [Route("/PostState")]
        public async Task<ActionResult> SaveState(State state) 
        {
            var res = await _IState.PostState(state);
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
        [Route("/DeleteStateById/{id}")]
        public async Task<ActionResult> DeleteState(int id)
        {
            var res = await _IState.DeleteStateById(id);
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