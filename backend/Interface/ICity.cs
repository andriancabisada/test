using Microsoft.AspNetCore.Mvc;
using Test.Models;

namespace Test.Interface
{
    public interface ICity
    {
        Task<IEnumerable<City>> GetCitiesAsync();
        Task<City> GetCityById(int id);
        Task<Boolean> Add(City city);
        Task<Boolean> Update(City city);
        Task<Boolean> Delete(int id);
    }
}
