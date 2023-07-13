using System.ComponentModel.DataAnnotations;

namespace Test.Models
{
    public class Country
    {
        [Key]
        public int CountryId { get; set; }
        public string Name { get; set; }
        //public List<State>? State { get; set; }
    }

    public class State
    {
        [Key]
        public int StateId { get; set; }
        public string Name { get; set; }
        //public List<City>? City { get; set; }
        public int? CountryId { get; set; }
        public Country? Country { get; set; }
    }

    public class City
    {
        [Key]
        public int CityId { get; set; }
        public string Name { get; set; }
        public int? StateId { get; set; }
        public State? State { get; set; }
    }


}
