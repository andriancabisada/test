using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Diagnostics.Metrics;
using Test.Context;
using Test.Interface;
using Test.Models;

namespace Test.Services
{
    public class StateService : IState
    {
        readonly DatabaseContext _dbContext = new();

        public StateService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<State>> GetStatesAsync()
        {
            return await _dbContext.States.Include(p => p.Country).ToListAsync();
        }

        public async Task<State> GetStateById(int id)
        {
            return await _dbContext.States.Where(x => x.StateId == id).FirstOrDefaultAsync();
        }
       


        public async Task<Boolean> PostState(State state)
        {
            try
            {
                _dbContext.States.Add(state);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<Boolean> PutState(State state)
        {
            try
            {
                _dbContext.Entry(state).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<Boolean> DeleteStateById(int Id)
        {
            try
            {
                var state = await _dbContext.States.FindAsync(Id);
                _dbContext.Entry(state).State = EntityState.Deleted;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
