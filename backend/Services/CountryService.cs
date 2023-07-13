using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using Test.Interface;
using Test.Models;
using Test.Context;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Test.Services
{
    public class CountryService : ICountry
    {
        readonly DatabaseContext _dbContext = new();

        public CountryService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            return await _dbContext.Countries.ToListAsync();
        }
        public async Task<Country> GetCountryById(int Id)
        {
            return await _dbContext.Countries.Where(x => x.CountryId == Id).FirstOrDefaultAsync();
        }
        public async Task<Boolean> PostCountry(Country country)
        {
            try
            {
                _dbContext.Countries.Add(country);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<Boolean> PutCountry(Country country)
        {
            try
            {
                _dbContext.Entry(country).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<Boolean> DeleteCountryById(int Id)
        {
            try
            {
                var country = await _dbContext.Countries.FindAsync(Id);
                _dbContext.Entry(country).State = EntityState.Deleted;
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
