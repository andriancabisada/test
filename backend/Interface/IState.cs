using Microsoft.AspNetCore.Mvc;
using Test.Models;

namespace Test.Interface
{
    public interface IState
    {
        Task<IEnumerable<State>> GetStatesAsync();
        Task<State> GetStateById(int id);
        
        Task<Boolean> PostState(State state);
        Task<Boolean> PutState(State state);
        Task<Boolean> DeleteStateById(int Id);
    }
}
