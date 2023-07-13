using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.Text.Json.Serialization;
using System.Text.Json;
using Test.Context;
using Test.Interface;
using Test.Models;

namespace Test.Services
{
    public class CityService : ICity
    {
        readonly DatabaseContext _dbContext = new();

        public CityService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<City>> GetCitiesAsync()
        {
            return await _dbContext.Cities.Include(p => p.State).ThenInclude(x=>x.Country).ToListAsync();
        }

        
        public async Task<City> GetCityById(int id)
        {
            return await _dbContext.Cities.Where(x => x.CityId == id).FirstOrDefaultAsync();
        }
        
        public async Task<Boolean> Add(City city)
        {
            try
            {
                _dbContext.Cities.Add(city);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<Boolean> Update(City city)
        {
            try
            {
                _dbContext.Entry(city).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<Boolean> Delete(int id)
        {
            try
            {
                var city = await _dbContext.Cities.FindAsync(id);
                _dbContext.Entry(city).State = EntityState.Deleted;
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
