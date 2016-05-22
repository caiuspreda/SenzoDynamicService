using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Swashbuckle.Swagger.Annotations;
using SenzoDynamicService.Models;
using SenzoDynamicService.Data.Provider;

namespace SenzoDynamicService.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        [SwaggerOperation("GetLastValues")]
        [SwaggerResponse(HttpStatusCode.OK)]
        public HttpResponseMessage Get(int noOfValues)
        {
            TableStorageProvider<SensorReadingEntry> storageProvider = new TableStorageProvider<SensorReadingEntry>("SensorData");
            return Request.CreateResponse<IEnumerable<SensorReadingEntry>>(HttpStatusCode.OK, storageProvider.GetLastValues(100).ToArray());
        }

        // POST api/values
        [SwaggerOperation("Create")]
        [SwaggerResponse(HttpStatusCode.OK, "Sensor value saved.", typeof(SensorReading))]
        public HttpResponseMessage Post([FromBody]SensorReading sensorReading)
        {
            TableStorageProvider<SensorReadingEntry> storageProvider = new TableStorageProvider<SensorReadingEntry>("SensorData");

            SensorReadingEntry sre = new SensorReadingEntry();
            sre.RowKey = sensorReading.SensorName;
            sre.Value = sensorReading.Value;
            sre.UtcTicks = DateTime.UtcNow.Ticks;
            storageProvider.Insert(sre);

            return Request.CreateResponse<SensorReading>(HttpStatusCode.OK, sensorReading);
        }

        // POST api/values
        //[SwaggerOperation("Dummy")]
        //[SwaggerResponse(HttpStatusCode.OK, "Dummy", typeof(int))]
        //public HttpResponseMessage Post([FromBody]int sensorReading)
        //{
        //    return Request.CreateResponse<int>(HttpStatusCode.OK, 10);
        //}

        // PUT api/values/5
        [SwaggerOperation("Update")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [SwaggerOperation("Delete")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public void Delete(int id)
        {
        }
    }
}
