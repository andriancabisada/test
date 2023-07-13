using Microsoft.AspNetCore.Mvc;
using Test.Models;

namespace Test.Interface
{
    public interface ICountry
    {
        Task<IEnumerable<Country>> GetCountriesAsync();
        Task<Country> GetCountryById(int Id);
        Task<Boolean> PostCountry(Country country);
        Task<Boolean> PutCountry(Country country);
        Task<Boolean> DeleteCountryById(int Id);
    }
}
